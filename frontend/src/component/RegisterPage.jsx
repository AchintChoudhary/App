
import axios from 'axios';
import {useState} from 'react'
import {Link,useNavigate} from "react-router-dom"

 import { toast } from 'react-toastify';

function RegisterPage() {

const navigate=useNavigate()

const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const[firstName,setFirstName]=useState("")
  const [userName,setUserName]=useState("")
const [gender,setGender]=useState("")

const selectGender=(params)=>{

setGender(params)
}


 const [loading,setLoading]=useState(false)

 const submitHandle=async(e)=>{
e.preventDefault()
setLoading(true)
try {
  const user={
    fullname:{
      firstname:firstName,
      lastname:lastName
    },
    email:email,
    password:password,
    username:userName,
    gender:gender


  }
  const response= await axios.post(`http://localhost:3000/users/register`,user)
  const data=response.data;
if(data.success===false){
  setLoading(false)
  return console.log(data.message)
}
toast.success(data.message)
console.log(data)
localStorage.setItem('chatApp',JSON.stringify(data))
setLoading(false)
navigate('/login')
} catch (error) {
  console.log(error)
setLoading(false)
            console.log(error)
            toast.error(error?.response?.data?.message)
              
}



}

    return (
        <>
   <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
  <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
    <h2 className="text-3xl font-bold text-center text-white mb-2">
      Create Account
    </h2>
    <p className="text-gray-400 text-center mb-8">
      Join our community today
    </p>

    <form onSubmit={submitHandle} className="space-y-6">
      {/* Full Name Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <input value={firstName}
               onChange={(e)=>{
                 setFirstName(e.target.value)
               }}
            type="text"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input  value={lastName}
               onChange={(e)=>{
                 setLastName(e.target.value)
               }}
            type="text"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Username *
        </label>
        <input  value={userName}
               onChange={(e)=>{
                 setUserName(e.target.value)
               }}
          type="text"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          placeholder="johndoe123"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input value={email}
               onChange={(e) => {
                 setEmail(e.target.value);
               }}
          type="email"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          placeholder="john@example.com"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Gender *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label  className=" flex items-center p-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <input onChange={()=>selectGender('male')}  type="radio" name="gender" value="male" className="mr-3 text-blue-500" />
            <span className="text-gray-300">Male</span>
          </label>
          <label className="flex items-center p-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <input onChange={()=>selectGender('female')}  
             type="radio" name="gender" value="female" className="mr-3 text-blue-500" />
            <span className="text-gray-300">Female</span>
          </label>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password *
        </label>
        <input  value={password}
               onChange={(e) => {
                 setPassword(e.target.value);
               }}
          type="password"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-400 mt-2">Must be at least 8 characters</p>
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-sm text-gray-400">Click to upload photo</p>
            </div>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-linear-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
      >
        {loading?'Loading...':'Signup'}
      </button>
    </form>

    <p className="text-center text-gray-400 text-sm mt-6">
      Already have an account?{' '}
      <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
        Log In 
      </a>
    </p>
  </div>
</div>




        
        </>
    )
}


export default RegisterPage;