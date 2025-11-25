
import React, { useState, useEffect, useContext } from "react";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userConversation from "../Zustand/UserConversation.js";
import { SocketContext } from "../context/SocketContext.jsx";

const Sidebar = ({ isMobile, showChat, setShowChat }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [messageCounter, setMessageCounter] = useState(null);
  
  const { selectedConversation, addMessage, setSelectedConversation } = userConversation();
  const { onlineUser, socket } = useContext(SocketContext);

  const isOnline = (userId) => onlineUser?.includes(userId);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (incomingMessage) => {
      setMessageCounter(incomingMessage);
      addMessage(incomingMessage);
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, addMessage]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.info("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/search/getuser?search=${encodeURIComponent(searchQuery)}`
      );
      const users = response.data;

      if (Array.isArray(users)) {
        if (users.length === 0) {
          toast.info("User not found");
          setSearchUser([]);
        } else {
          setSearchUser(users);
          toast.success(`Found ${users.length} user(s)`);
        }
      } else if (users && users.success === false) {
        toast.error(users.message || "Search failed");
        setSearchUser([]);
      } else if (users && Array.isArray(users.data)) {
        if (users.data.length === 0) {
          toast.info("User not found");
          setSearchUser([]);
        } else {
          setSearchUser(users.data);
          toast.success(`Found ${users.data.length} user(s)`);
        }
      } else {
        toast.info("No users found");
        setSearchUser([]);
      }
    } catch (error) {
      console.log("Search error:", error);
      toast.error("Search failed. Please try again.");
      setSearchUser([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedConversation(user);
    setMessageCounter('');
    if (isMobile) {
      setShowChat(true);
    }
  };

  useEffect(() => {
    const chatUserHandler = async () => {
      if (!authUser) {
        console.log("No auth user, skipping chatters fetch");
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/search/getchatters`);
        const data = response.data;
        if (Array.isArray(data)) {
          setChatUser(data);
        } else {
          // console.log("❌ Unexpected response format:", data);
          setChatUser([]);
        }
      } catch (error) {
        console.log(error);
        setChatUser([]);
      } finally {
        setLoading(false);
      }
    };

    chatUserHandler();
  }, [authUser]);

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchQuery("");
  };

  const handleLogOut = async () => {
    const confirmLogout = window.prompt("write username to confirm logout");
    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const Logout = await axiosInstance.get(`/users/logout`);
        const data = Logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("chatApp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("logout cancelled");
    }
  };

  return (
    <div className={`
      flex flex-col 
      ${isMobile ? (showChat ? 'hidden' : 'w-full') : 'w-full md:w-80'} 
      bg-gray-800 border-r border-gray-700
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">ChatApp</h1>
          <img
            src={authUser?.profilepic}
            alt={authUser?.fullname?.firstname}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-blue-400 transition-colors"
              >
                <FaPaperPlane className="text-gray-400 hover:text-blue-400" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : searchUser?.length > 0 ? (
          <>
            {searchUser.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                  selectedConversation?._id === user._id ? "bg-gray-700" : ""
                }`}
              >
                <div className="relative inline-block">
                  <img
                    src={user.profilepic}
                    alt={user.fullname?.firstname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white">
                      {user.username}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    {user.fullname?.firstname} {user.fullname?.lastname}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {chatUser.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-center px-4">
                  No conversations yet. Search for users to start chatting!
                </p>
              </div>
            ) : (
              <>
                {chatUser.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                      selectedConversation?._id === user._id ? "bg-gray-700" : ""
                    }`}
                  >
                    <div className="relative inline-block">
                      <img
                        src={user.profilepic}
                        alt={user.fullname?.firstname}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isOnline(user._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></span>
                      )}
                    </div>

                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-white">
                          {user.username}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        {user.fullname?.firstname} {user.fullname?.lastname}
                      </p>
                    </div>
                    {messageCounter?.receiverId === authUser?._id &&
                     messageCounter?.senderId === user._id && (
                      <div className="relative">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400 font-bold text-[10px] text-black shadow-md">
                          +1
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700 flex justify-between">
        <button
          onClick={handleSearchBack}
          disabled={searchUser.length === 0}
          className={`flex items-center p-3 rounded-lg transition-colors ${
            searchUser.length === 0 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-red-400 hover:bg-gray-700'
          }`}
        >
          <FaArrowLeft className="text-lg" />
        </button>
        <button
          onClick={handleLogOut}
          className="flex items-center p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="font-medium hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;