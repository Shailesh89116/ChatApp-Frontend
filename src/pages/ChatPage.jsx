import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellenious/SideDrawer";   
import { useNavigate } from "react-router-dom";
import MyChats from "../components/miscellenious/MyChats";
import ChatBox from "../components/miscellenious/ChatBox";
import { ChatState } from "../context/ChatProvider";

const Chatpage = () => {
  
  const data= localStorage.getItem('userInfo');
  const user=JSON.parse(data);

  // const {user}=ChatState();
  // console.log(user);
  const navigate=useNavigate();
  useEffect(()=>{
    if(!user){
      navigate("/")
    }
  },[navigate])
  return (
    <div style={{ width: "100%" }}>
       {user && <SideDrawer />}
      <Box style={{display:"flex"}} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats/>}
        {user &&  <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;