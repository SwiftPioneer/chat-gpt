import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import React from 'react';
import NoPage from './components/NoPage';
import ChatPage from './containers/chat/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/*" element={<NoPage />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
