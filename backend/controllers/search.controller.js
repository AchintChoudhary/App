import conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user._id;

    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { "fullname.firstname": { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        { _id: { $ne: currentUserId } },
      ],
    })
      .select("-password")
      .select("email username fullname");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find conversations involving the current user
    const currentchatters = await conversation
      .find({ participants: currentUserId })
      .sort({ updatedAt: -1 });

    if (!currentchatters || currentchatters.length === 0) {
      return res.status(200).send([]);
    }

    // Collect all participant IDs (excluding self)
    const participantsID = currentchatters.reduce((ids, conv) => {
      const others = (conv.participants || [])
        .filter(
          id => id && id.toString() !== currentUserId.toString() // prevent null error
        );
      return [...ids, ...others];
    }, []);

    // Remove duplicates
    const otherParticipantsID = [...new Set(participantsID)];

    // Fetch their user documents
    const userDocs = await User.find({ _id: { $in: otherParticipantsID } }).select(
      "-password -email"
    );

    // Order users in the same order as the conversation recency
    const orderedUsers = otherParticipantsID
      .map(id => userDocs.find(u => u._id.toString() === id.toString()))
      .filter(Boolean); // remove nulls just in case

    // Send response
    res.status(200).send(orderedUsers);
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
