import React, { useState, useEffect, useContext} from 'react';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaArrowLeft,FaSignOutAlt  } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'
import userConversation from '../Zustand/UserConversation.js';
const ChatApp = () => {
  const navigate=useNavigate()
   const { authUser,setAuthUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
const [loading,setLoading]=useState(false)
const [searchUser,setSearchUser]=useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

const [chatUser,setChatUser]=useState([])
const { selectedConversation,setSelectedConversation, messages}=userConversation()


const handleSearchSubmit = async (e) => {
  e.preventDefault();
  
  // Don't search if query is empty
  if (!searchQuery.trim()) {
    toast.info("Please enter a search term");
    return;
  }

  setLoading(true);
  try {
    const response = await axiosInstance.get(`/search/getuser?search=${encodeURIComponent(searchQuery)}`);
    const users = response.data;
    
   
    
    // Check if response is an array or has specific structure
    if (Array.isArray(users)) {
      if (users.length === 0) {
        toast.info("User not found");
        setSearchUser([]);
      } else {
        setSearchUser(users);
        toast.success(`Found ${users.length} user(s)`);
      }
    } 
    // If your API returns an object with success property
    else if (users && users.success === false) {
      toast.error(users.message || "Search failed");
      setSearchUser([]);
    }
    // If your API returns an object with data array
    else if (users && Array.isArray(users.data)) {
      if (users.data.length === 0) {
        toast.info("User not found");
        setSearchUser([]);
      } else {
        setSearchUser(users.data);
        toast.success(`Found ${users.data.length} user(s)`);
      }
    }
    else {
      toast.info("No users found");
      setSearchUser([]);
    }
   

  } catch (error) {
    console.log('Search error:', error);
    toast.error("Search failed. Please try again.");
    setSearchUser([]);
  } finally {
    setLoading(false);
  }
};



 


 // Handle user selection
  const handleUserSelect = (user) => {
  setSelectedUser(user)
   setSelectedConversation(user)
    if (isMobile) {
      setShowChat(true);
    }
  };

  

  // Check screen size for mobile responsiveness
  useEffect(() => {
    const chatUserHandler=async()=>{
        if (!authUser) {
        console.log('No auth user, skipping chatters fetch');
        return;
      }
try {
  setLoading(true)
  const response = await axiosInstance.get(`/search/getchatters`);
 const data=response.data
 console.log('✅ Chatters response:', data);
   if (Array.isArray(data)) {
          setChatUser(data);
          console.log('✅ Chatters set to state:', data.length, 'users');
          

        } else {
          console.log('❌ Unexpected response format:', data);
          setChatUser([]);
        }
     
  
} catch (error) {
  console.log(error)
    
  setChatUser([]);
}
    }
     
    chatUserHandler()

   
  }, [authUser]);


const handleSearchBack=()=>{
  setSearchUser([])
  setSearchQuery('')
}

const handleLogOut=async()=>{
const confirmLogout=window.prompt('write username to confirm logout')
if(confirmLogout===authUser.username){
 setLoading(true)
  try{
const Logout=await axiosInstance.get(`/users/logout`)
const data=Logout.data
if(data.success===false){
  setLoading(false)
  console.log(data.message)
  }
toast.info(data.message)
localStorage.removeItem('chatApp')
setAuthUser(null)
setLoading(false)
navigate('/login')
  }catch(error){
    setLoading(false)
console.log(error)
  }
}else{
  toast.info('logout cancelled')
}

 
}



  return (
    <>
    

 
  {/* Sidebar/Contacts List */}
  <div className={`flex flex-col w-full md:w-80 bg-gray-800 border-r border-gray-700 ${showChat && isMobile ? 'hidden' : 'flex'}`}>
    {/* Header */}
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">ChatApp</h1>
       <img
                src={authUser.profilepic}
                alt={authUser.fullname.firstname}
                className="w-10 h-10 rounded-full"
              />
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search greatstack.."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            
            {/* Submit Button on Right */}
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
      {searchUser?.length > 0 ? (
        <>
          {searchUser.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                selectedUser?._id === user._id ? 'bg-gray-700' : ''
              }`}
            >
              <img
                src={user.profilepic}
                alt={user.fullname.firstname}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">{user.username}</h3>
                </div>
              </div>
            </div>
            
          ))}
            
        </>
      ) : (
        <>
          {chatUser.length === 0 ? (
            <>
              <h1>why are Alone</h1>
            </>
          ) : (
            <>
              {chatUser.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                    selectedUser?._id === user._id ? 'bg-gray-700' : ''
                  }`}
                >
                  <img
                    src={user.profilepic}
                    alt={user.fullname.firstname}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-white">{user.username}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>

    {/* Logout Button - Bottom Left */}
    <div className="p-4  border-gray-700 flex justify-between ">

      
      <button 
       onClick={handleSearchBack}
        className="flex items-center p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <FaArrowLeft className="mr-3" />
        
      </button>
       <button 
       onClick={handleLogOut}
        className="flex items-center p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <FaSignOutAlt className="mr-3" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  </div>



</>

  
  );
};

export default ChatApp;