import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider'
import GroupChatModal from './miscellenious/GroupChatModal';
import ProfileModal from './miscellenious/ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import '../style.css'
import ScrollableChat from './userAvatar/ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animation/typingAnimation.json'

const ENDPOINT = 'http://localhost:5000';

var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages]=useState([]);
    const [loading, setLoading]= useState(false);
    const [newMessage, setNewMessage]=useState();
    const [socketConnected,setSocketConnected]=useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setIsTyping]=useState(false);

    const { selectedChat, setSelectedChat,notification, setNotification}=ChatState();

    const user=JSON.parse(localStorage.getItem("userInfo"));

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>{
            setSocketConnected(true);
        });
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    },[]);

    useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    setMessages([...messages, newMessageRecieved]);
    });
  });

  

    const defaultOption={
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSetting: {
            preserveAspectRation: "xMidYMid slice"
        }
    }

    const toast=useToast();

    const fetchMessages=async()=>{
        if(!selectedChat) return;

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
          
            setMessages(data);
            setLoading(false);

            socket.emit('join chat',selectedChat._id);

        } catch (error) {
            console.log(error);
            toast({
                title: "Failed to load message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }

    useEffect(()=>{
        fetchMessages();

        selectedChatCompare = selectedChat;

        console.log(notification);
    },[selectedChat]);

    

    const sendMessage=async(event)=>{
        if(event.key === 'Enter' && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try {
                const config={
                    headers:{
                        "content-type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }

                const {data}= await axios.post(`http://localhost:5000/api/message`,{
                    content: newMessage, chatId: selectedChat._id
                },config);

            

                setNewMessage("");

                socket.emit('new message',data);

                setMessages([...messages,data]);
            } catch (error) {
                toast({
                    title: "Error Occured",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
            }
        }
    };

    

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
    }


  return (
    
    <>
     {!selectedChat && <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="sans-serif">
                Click on User to Start Chatting
            </Text>
        </Box> }
    {selectedChat &&
    <>
    <Text 
    fontSize={{base:"28px", md:"30px"}}
    pb={3}
    px={2}
    w="100%"
    fontFamily="sans-serif"
    display="flex"
    justifyContent={{base:"space-between"}}
    alignItems="center">
        <IconButton
        display={{base:"flex", md:"none"}}
        icon={<ArrowBackIcon/>}
        onClick={()=>setSelectedChat("")}/>
        {!selectedChat.isGroupChat ? (
            <>
            {getSender(user,selectedChat.users)}
            <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
            </>
        ):(
            <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
            </>
        )}
    </Text>
     <Box display="flex"
    flexDir="column"
    p={3}
    justifyContent="flex-end"
    bg="#E8E8E8"
    w="100%"
    h="100%"
    borderRadius="lg"
    overflowY="hidden"
    >
        {loading ? (
            <Spinner
            size="lg"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
            />
        ):
        (
            <div className='messages'>
            <ScrollableChat messages={messages}/>
            </div>
        )}
        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
           
            {isTyping ? <div><Lottie
            options={defaultOption}
             width={70} style={{marginBottom:15, marginRight:0}}/></div>:(<></>)}
            <Input variant="filled" bg="#E0E0E0" placeholder='Enter a message....'
            onChange={typingHandler}
            value={newMessage}/>
            
        </FormControl>
   
    </Box>
    </>
    }
   
    </>
  )
}

export default SingleChat
