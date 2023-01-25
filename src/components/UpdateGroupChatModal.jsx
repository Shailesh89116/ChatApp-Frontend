import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    Image,
    Text,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from './userAvatar/UserListItem';


const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupName,setGroupName]=useState();
    const [selectedUser,setSelectedUser]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameLoading]=useState(false);

    const toast=useToast();

    const user=JSON.parse(localStorage.getItem("userInfo"))

    const {selectedChat,setSelectedChat}=ChatState();

    const handleRemove=async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1.id !== user._id){
            toast({
                title: "Only Admin can remove someone",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }

        try {
            setLoading(true);
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            };

            const {data}=await axios.put(`http://localhost:5000/api/chat/groupremove`,{
                chatId: selectedChat._id, userId:user1._id
            },config);

            user1._id === user.id ? setSearch() : setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }

    }

    const handleLeave=async(user1)=>{
        try {
            setLoading(true);
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            };

            const {data}=await axios.put(`http://localhost:5000/api/chat/groupremove`,{
                chatId: selectedChat._id, userId:user1._id
            },config);

            user1._id === user.id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setLoading(false)
            onClose();
        } catch (error) {
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }

    }

    const handleRename=async()=>{
        if(!groupName){
            return;
        }

        try {
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            };

            const {data}=await axios.put(`http://localhost:5000/api/chat/rename`,{
                chatId: selectedChat._id, chatName: groupName
            },config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)

        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameLoading(false)
        }
        setGroupName("")
    }

    const handleSearch=async(query)=>{
        setSearch(query);

        if(!query){
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data}=await axios.get(`http://localhost:5000/api/user?search=${query}`,config);
           
            setLoading(false);
            setSearchResult(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddUsers=async(user1)=>{
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title: "User Already Existing in Group",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admin can add someone",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        try {
            setLoading(true);
            const config={
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            };

            const {data}=await axios.put(`http://localhost:5000/api/chat/groupadd`,{
                chatId: selectedChat._id, userId:user1._id
            },config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)

        } catch (error) {
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

   
  return (
    <>
   
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

     <Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
      <ModalOverlay />
      <ModalContent height="410px">
        <ModalHeader 
        fontSize='40px'
        fontFamily="sans-serif"
        display='flex'
        justifyContent="center">{selectedChat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
        <Box  width="100%" display="flex" flexWrap="wrap">
            {selectedChat.users.map(user=>{
                return(
                    <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleRemove(user)}/>
                )
            })}
        </Box>
        <FormControl display="flex">
            <Input
            placeholder='Chat Name'
            mb={3}
            value={groupName}
            onChange={(e)=>{setGroupName(e.target.value)}}/>
            <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameLoading}
            onClick={handleRename}
            >Update</Button>
        </FormControl>
        <FormControl>
            <Input placeholder='Add Users' mb={3} onChange={(e)=>{handleSearch(e.target.value)}}/>
          </FormControl>
          <ModalBody >
          {loading ? <Spinner size="lg"/> : (
            searchResult?.slice(0,4).map(user=>{
                return(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUsers(user)}/>
                )
            })
          )}
        </ModalBody>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3}  onClick={()=> handleLeave(user)}>
         Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default UpdateGroupChatModal
