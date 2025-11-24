import { useState, useContext, useEffect,useRef } from "react";
import { FaPaperPlane, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import Lottie from "lottie-react";
import axiosInstance from "../utils/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import userConversation from "../Zustand/UserConversation";
import animationData from "../animation/animation.json";
import notify from '../assets/notification.mp3'
import { SocketContext } from "../context/SocketContext";


const MessageContainer = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const {socket} =useContext(SocketContext)
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage,setNewMessage]=useState('')
  const lastMessageRef=useRef()
  const {
    selectedConversation,
    setMessages,
    setSelectedConversation,
    messages,
  } = userConversation();
  const [loading, setLoading] = useState(false);

useEffect(() => {
  
setTimeout(() => {
  lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
}, 100);
  
}, [messages])


useEffect(()=>{
  socket?.on('newMessage',(newMessage)=>{
    const sound=new Audio(notify);

    sound.play();
    setMessages([...messages,newMessage])
  })
  return ()=>{
    socket?.off('newMessage')
  
  }

},[socket,setMessages,messages])



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
          console.log(data.messages);
          return;
        }

        setLoading(false);
        setMessages(data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (selectedConversation?._id) {
      getMessage();
    }
  }, [selectedConversation?._id, setMessages]);


const handleSubmit=async(e)=>{
e.preventDefault()
setLoading(true)
  try{
const res=await axiosInstance.post(`messages/send/${selectedConversation?._id}`,{message:newMessage});
    const data=res.data;
if(data.success === false) {
          setLoading(false);
          console.log(data.messages);
          return;
        }

        setLoading(false);
        setMessages([...messages,data]);
        setNewMessage("")
  }catch(error){
    console.log(error.message)
    setLoading(false)
  }
}




  return (
    <>
      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col h-screen ${
          !showChat && isMobile ? "hidden" : "flex"
        }`}
      >
        {selectedConversation === null ? (
          <>
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPaperPlane className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Welcome to Chatapp
                </h3>
                <p className="text-gray-400">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <>
              {/* Chat Header */}
              <div className="flex flex-col h-full bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                  <div className="flex items-center">
                    {isMobile && (
                      <button
                        // onClick={() => setShowChat(false)}
                        className="mr-3 p-2 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <FaArrowLeft className="text-gray-400" />
                      </button>
                    )}
                    <img
                      src={selectedConversation.profilepic}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h2 className="font-semibold text-white">
                        {selectedConversation?.username}
                      </h2>
                      <p className="text-xs text-green-400">Online</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <FaEllipsisV className="text-gray-400" />
                  </button>
                </div>

                {loading && (
                  <div className="flex-1 flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                      <div className="w-24 h-24  rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lottie animationData={animationData} loop autoplay />
                      </div>
                    </div>
                  </div>
                )}
                {!loading && messages?.length === 0 && (
                  <div className="flex-1 flex items-center justify-center bg-gray-900">
                    <p className="text-gray-400">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
                {/* Messages Container */}
               {/* Messages Container */}
{!loading && messages?.length > 0 && (
  <div className="flex-1 overflow-y-auto p-4 bg-gray-900" ref={lastMessageRef}>
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={message._id || index}
          className={`flex ${
            message.senderId === authUser._id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.senderId === authUser._id
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-700 text-white rounded-bl-none"
            }`}
          >
            <p className="text-sm">{message.message}</p>
            <p className="text-xs opacity-70 text-right mt-1">
              {new Date(message.createdAt).toLocaleString("en-IN", {
                hour: "numeric",
                minute: "numeric",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

                {/* Message Input */}
              </div>
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </form>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
};

export default MessageContainer;
