import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
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

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages]=useState([]);
    const [loading, setLoading]= useState(false);
    const [newMessage, setNewMessage]=useState();

    const { selectedChat, setSelectedChat}=ChatState();

    const user=JSON.parse(localStorage.getItem("userInfo"));

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
    },[selectedChat])

    const sendMessage=async(event)=>{
        if(event.key === 'Enter' && newMessage){
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

                console.log(data);

                setNewMessage("");
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
    }

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        //typing indicator login
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
        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
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
