import React, { createContext, useState } from "react";
import { useEffect } from "react";
import API from "../API";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("utoken");
    return token || null;
  });

  useEffect(() => {
    console.log("Current user updated", currentUser);
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("Token updated", token);
    if (token) {
      localStorage.setItem("utoken", token);
    } else {
      localStorage.removeItem("utoken");
    }
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/users/login", { email, password });
      console.log("Login response", data);
      setCurrentUser({ email: data.email });
      setToken(data.token);
    } catch (error) {
      console.log("Login error", error);
      throw error;
    }
  };

  // Signup
  const signup = async (email, username, password) => {
    try {
      const { data } = await API.post("/users/signup", {
        email,
        username,
        password,
      });
      console.log("Registration response data: ", data);

      setCurrentUser({ email: data.email });
      setToken(data.token);

      return true;
    } catch (error) {
      console.error("Registration error: ", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    console.log("Logging out");

    setCurrentUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("utoken");
  };

  // Return the AuthContext provider with the context value
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
