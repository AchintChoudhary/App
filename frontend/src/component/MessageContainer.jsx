import React from 'react'

const MessageContainer = () => {
  return (
    <div>{/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!showChat && isMobile ? 'hidden' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => setShowChat(false)}
                    className="mr-3 p-2 hover:bg-gray-700 rounded-full"
                  >
                    <FaArrowLeft className="text-gray-400" />
                  </button>
                )}
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <h2 className="font-semibold text-white">{selectedUser.name}</h2>
                  <p className="text-xs text-green-400">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-full">
                <FaEllipsisV className="text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-700 text-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 text-right mt-1">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </>
        ) : (
          // Empty State
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
        )}
      </div></div>
  )
}

export default MessageContainer