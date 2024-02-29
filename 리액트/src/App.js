import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import Lv2page from './components/Lv2page';
import Lv3page from './components/Lv3page';
import RegisterDetail from './components/RegisterDetail';
import Head from './components/Head';
import './App.css';
import './HYUN.css';

function App() {
  return (
    <AppProvider>
      <>
        <Router>
          <LoggedInHead />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Main />} />
            <Route path="/lv2page" element={<Lv2page />} />
            <Route path="/lv3page" element={<Lv3page />} />
            <Route path="/register_detail/:bunho" element={<RegisterDetail />} />
          </Routes>
        </Router>
      </>
    </AppProvider>
  );
}

function LoggedInHead() {
  const { isLoggedIn } = useAppContext();

  return (
    <>
      {isLoggedIn ? (// 로그인
        <>
          <Head/>
        </>
      ) : ( // 비로그인
        <>
        </>
      )}
    </>
  );
}

export default App;
