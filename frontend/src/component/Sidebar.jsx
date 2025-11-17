import React, { useState, useEffect } from 'react';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
const [loading,setLoading]=useState(false)
const [searchUser,setSearchUser]=useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

const [chatUser,setChatUser]=useState([])

 const handleSearchSubmit=async(e)=>{
  e.preventDefault()
  setLoading(true)
  try {
    const response=await axios.get(`http://localhost:3000/search/getuser?search=${searchQuery}`)
    
    const users=response.data;
    if(users.success===false){
  setLoading(false)
 console.log(users.message)
}
    setLoading(false)
    if(users.loading===0){
toast.info("User Not found")
    }else{
setSearchUser(users)
    }
  } catch (error) {
    setLoading(false)
    console.log(error)
  }
 }



 


 // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
   
    if (isMobile) {
      setShowChat(true);
    }
  };

  // Handle sending new message
  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim()) {
  //     const newMsg = {
  //       id: messages.length + 1,
  //       text: newMessage,
  //       sender: 'me',
  //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //     };
  //     setMessages([...messages, newMsg]);
  //     setNewMessage('');
  //   }
  // };

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const chatUserHandler=async()=>{
try {
  setLoading(true)
  const chatters=await axios.get(`http://localhost:3000/search/getchatters`, { withCredentials: true })
 const data=chatters.data;
    if(data.success===false){
  setLoading(false)
 console.log(data.message)
}
    setLoading(false)
 
setChatUser(data)
    
  
} catch (error) {
  console.log(error)
}
    }
    chatUserHandler()

    console.log(chatUser);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar/Contacts List */}
      <div className={`flex flex-col w-full md:w-80 bg-gray-800 border-r border-gray-700 ${showChat && isMobile ? 'hidden' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Chatapp</h1>
            <button className="p-2 hover:bg-gray-700 rounded-full">
              <FaEllipsisV className="text-gray-400" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <form onSubmit={handleSearchSubmit}>
 <input
              type="text"
              placeholder="Search greatstack.."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            </form>
           
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
{
searchUser?.length > 0?(
<>

</>
):(
  <>
  {
    chatUser.length===0?(<>
    <div>why you are alone</div>
    </>):(<>
    {chatUser.map(user=>{
      <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                selectedUser?.id === user.id ? 'bg-gray-700' : ''
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <span className="text-xs text-gray-400">{user.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-400 truncate max-w-[180px]">
                    {user.lastMessage}
                  </p>
                  {user.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
    })}
    </>)
  }
  </>
)
}




          {/* {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                selectedUser?.id === user.id ? 'bg-gray-700' : ''
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <span className="text-xs text-gray-400">{user.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-400 truncate max-w-[180px]">
                    {user.lastMessage}
                  </p>
                  {user.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </div> */}
          {/* ))} */}
        </div>
      </div>

      
    </div>
  );
};

export default ChatApp;