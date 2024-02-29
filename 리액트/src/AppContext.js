import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [User, setUser] = useState('');
  const [Ccode, setCcode] = useState('');
  const [appName] = useState("sola");
  const [appName1] = useState("management");

  console.log('Initial Ccode value:', Ccode);

  useEffect(() => {
    const storedUser = localStorage.getItem('User');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
    const storedCcode = localStorage.getItem('Ccode');
    console.log('Stored Ccode:', storedCcode);
    if (storedCcode) {
      setCcode(storedCcode);
    }
  }, []);

  useEffect(() => {
    console.log('Current Ccode:', Ccode);
  }, [Ccode]);
  

  const login = (User, Ccode) => {
    setIsLoggedIn(true);
    setUser(User);
    localStorage.setItem('User', User);
    setCcode(Ccode);
    localStorage.setItem('Ccode', Ccode);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser('');
    localStorage.removeItem('User');
    setCcode('');
    localStorage.removeItem('Ccode');
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, User, Ccode, login, logout, appName, appName1 }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
