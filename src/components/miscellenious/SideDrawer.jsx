import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  
  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
 
  const data= localStorage.getItem('userInfo');
  const user=JSON.parse(data);
  
 

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()
  

  const logout = () => {
    localStorage.removeItem('userInfo');
    navigate("/");
  };

  const toast=useToast();

  const handleSearch=async()=>{
    if(!search){
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return
    }

    try {
      setLoading(true);

      const config={
        headers:{
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
      if(data){
        setLoading(false);
      setSearchResult(data);
      }
      if(!data){
        toast({
          title: "User Does Not Exist",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const accessChat=async(userId)=>{
      try {
        setLoadingChat(true);
      const config={
        "content-type":"application/json",
        headers:{
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data}= await axios.post(`http://localhost:5000/api/chat`,{userId},config);
      console.log(data);

      if(!chats.find((c)=>c._id === data._id)) setChats([data,...chats]);
      
     
      setLoadingChat(false);
      onClose();
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }

  return (
    <div>
      <Box
        style={{ display: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="sans-serif">
          React Chat
        </Text>
        <div>
        <Menu>
          <MenuButton p={1}>
          <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            <BellIcon  fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}> 
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logout}>LogOut</MenuItem>
          </MenuList>
        </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
       onOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
            <Input placeholder='Search by Name or Email' mr={2} value={search} onChange={(e)=> setSearch(e.target.value)} />
            <Button 
             onClick={handleSearch}
            >Go</Button>
            </Box>
            {loading ?
            (
              <ChatLoading/>
            ):(searchResult?.map(user=>{
              return(
                <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>
              )
            }))}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
