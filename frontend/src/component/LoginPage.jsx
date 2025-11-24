import { useContext, useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'

 import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosConfig'; 
function LoginPage(){

const {setAuthUser}=useContext(AuthContext)

const navigate=useNavigate()
 const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [loading,setLoading]=useState(false)

    const handleSubmit=async(e)=>{
e.preventDefault()



    setLoading(true)
        try {
            const response = await axiosInstance.post(`/users/login`, {
  email: email,
  password: password
});
const data=response.data;
if(data.success===false){
  setLoading(false)
  return console.log(data.message)
}
toast.success(data.message)
console.log(data)
localStorage.setItem('chatApp',JSON.stringify(data))
setAuthUser(data)
setLoading(false)
navigate('/')
} catch (error) {
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
      Login
    </h2>
   

    <form onSubmit={handleSubmit} className="space-y-6">
     

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input
        value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          type="email"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          placeholder="john@example.com"
        />
      </div>

     
      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password *
        </label>
        <input
         value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          type="password"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          placeholder="••••••••"
        />
        <p className="text-xs text-gray-400 mt-2">Must be at least 8 characters</p>
      </div>

     

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-linear-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
      >
        {loading?'Loading...':'Login'}
      </button>
    </form>

    <p className="text-center text-gray-400 text-sm mt-6">
      Not a member?{' '}
      <Link to='/register' className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
        Signup now
      </Link>
    </p>
  </div>
</div>
    </>
)
}

export default LoginPage;