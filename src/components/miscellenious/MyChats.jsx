import React from "react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain, setFetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, setChats, chats } = ChatState();
 
  useEffect(() => {
    fetchChats();
  }, [loggedUser]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const toast = useToast();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="grey"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="sans-serif"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(loggedUser,chat.users) : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
