import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('chatApp');
    if (userData) {
      try {
        setAuthUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('chatApp');
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};