// component/MessageContainer.jsx
import { useState, useContext, useEffect, useRef, useLayoutEffect } from "react";
import { FaPaperPlane, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import Lottie from "lottie-react";
import axiosInstance from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import userConversation from "../Zustand/UserConversation";
import animationData from "../animation/animation.json";
import notify from "../assets/notification.mp3";
import { SocketContext } from "../context/SocketContext";

const MessageContainer = ({ isMobile, showChat, setShowChat }) => {
  const { authUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);
  const {
    selectedConversation,
    setMessages,
    messages,
    addMessage,
  } = userConversation();

  useLayoutEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, selectedConversation]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incomingMessage) => {
      const isCurrentChat =
        incomingMessage.senderId === selectedConversation?._id ||
        incomingMessage.receiverId === selectedConversation?._id;

      if (!isCurrentChat) return;

      const sound = new Audio(notify);
      sound.play();
      addMessage(incomingMessage);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, addMessage, selectedConversation]);

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `messages/${selectedConversation?._id}`
        );
        const data = res.data;

        if (data.success === false) {
          setLoading(false);
          // console.log(data.messages);
          return;
        }

        setLoading(false);
        setMessages(data);
      } catch (err) {
        // console.error(err);
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessage();
    }
  }, [selectedConversation?._id, setMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedConversation?._id}`,
        { message: newMessage }
      );
      const data = res.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.messages);
        return;
      }

      setLoading(false);
      addMessage(data);
      setNewMessage("");
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  return (
    <div className={`
      flex flex-col h-screen
      ${isMobile ? (showChat ? 'flex' : 'hidden') : 'flex flex-1'}
    `}>
      {selectedConversation === null ? (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center p-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPaperPlane className="text-2xl sm:text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
              Welcome to ChatApp
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-gray-900">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={handleBackToContacts}
                  className="mr-3 p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FaArrowLeft className="text-gray-400 text-sm" />
                </button>
              )}
              <img
                src={selectedConversation.profilepic}
                alt={selectedConversation.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <h2 className="font-semibold text-white text-sm sm:text-base">
                  {selectedConversation?.username}
                </h2>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <FaEllipsisV className="text-gray-400 text-sm" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto">
                  <Lottie animationData={animationData} loop autoplay />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && messages?.length === 0 && (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <p className="text-gray-400 text-sm sm:text-base px-4 text-center">
                Send a message to start the conversation
              </p>
            </div>
          )}

          {/* Messages Container */}
          {!loading && messages?.length > 0 && (
            <div 
              className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-900"
              ref={chatContainerRef}
            >
              <div className="space-y-3 sm:space-y-4">
                {messages
                  .filter(
                    (msg) =>
                      msg.senderId === selectedConversation?._id ||
                      msg.receiverId === selectedConversation?._id
                  )
                  .map((message, index) => (
                    <div  
                      key={message._id || index}
                      className={`flex ${
                        message.senderId === authUser._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-2xl ${
                          message.senderId === authUser._id
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-700 text-white rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm sm:text-base break-words">
                          {message.message}
                        </p>
                        <p className="text-xs opacity-70 text-right mt-1">
                          {new Date(message.createdAt).toLocaleString(
                            "en-IN",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-3 sm:p-4 border-t border-gray-700 bg-gray-800">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-full transition-colors duration-200 flex items-center justify-center"
              >
                <FaPaperPlane className="text-xs sm:text-sm" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;