import React from 'react'
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
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import { useEffect } from 'react'

const GroupChatModal = ({children,fetchAgain,setFetchAgain}) => {

    const [groupName,setGroupName]=useState();
    const [selectedUser,setSelectedUser]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);

    const toast=useToast();
    const user=JSON.parse(localStorage.getItem("userInfo"))
    const {chats,setChats}=ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

    

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

            const {data}=await axios.get(`http://13.234.77.255:5000/api/user?search=${query}`,config);
           
            setLoading(false);
            setSearchResult(data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit=async()=>{
        if(!groupName){
            toast({
                title: "Group name should not be empty",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return
        }
        if(!selectedUser){
            toast({
                title: "Group cannot be empty",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return
        }

        if(selectedUser.length<2){
            toast({
                title: "add atleast 2 user",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return
        }

        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };

              const {data}=axios.post(`http://13.234.77.255:5000/api/chat/group`,{
                name:groupName,
                users: JSON.stringify(selectedUser.map(u=> u._id)),
              },config);

              setChats(data,...chats);
              onClose();
              toast({
                title: "Group created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setFetchAgain(!fetchAgain);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    const handleGroup=(user)=>{
        if(selectedUser.includes(user)){
            return;
        }
        setSelectedUser([...selectedUser,user]);
    }

   const handleDelete=(deleteUser)=>{
        setSelectedUser(selectedUser.filter((sel)=> sel._id !== deleteUser._id))
    }

  

  return (
    <>
    {children ? (
      <span onClick={onOpen}>{children}</span>
    ) : (
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    )}
     <Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered >
      <ModalOverlay />
      <ModalContent height="410px">
        <ModalHeader 
        fontSize='40px'
        fontFamily="sans-serif"
        display='flex'
        justifyContent="center">Create Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir='column' alignItems="center" justifyContent="space-between"   overflowY="auto" >
          <FormControl>
            <Input placeholder='Group Name' mb={3} onChange={(e)=>{setGroupName(e.target.value)}}/>
          </FormControl>
            {/* selected Users */}
          <Box width="100%" display="flex" flexWrap="wrap">
        {selectedUser.map(user=>{
            return(
                <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>
            )
        })}
        </Box>
          <FormControl>
            <Input placeholder='Add Users' mb={3} onChange={(e)=>{handleSearch(e.target.value)}}/>
          </FormControl>
          {/* render Search user */}
          <Box  display="flex" flexDir='column' alignItems="center" justifyContent="space-between"   overflowY="auto">
          {loading ? <div>Loading.....</div> : (
            searchResult?.slice(0,4).map(user=>{
                return(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}>
                       
                        handleFunction={()=>handleGroup(user)}
                    </UserListItem>
                )
            })
          )}
         </Box>
          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
          Create Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal
