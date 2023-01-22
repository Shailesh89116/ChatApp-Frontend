import "./App.css";
import LoginPage from "./Pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chatpage from "./Pages/ChatPage";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
     <ChatProvider>
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/chats" element={<Chatpage/>}  />
      </Routes>
      </ChatProvider>
   
  );
}

export default App;