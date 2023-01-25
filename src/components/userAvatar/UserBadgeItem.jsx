import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatProvider'

const UserBadgeItem = ({user,handleFunction}) => {

  const {selectedChat} =ChatState();

const admin=Object.values(selectedChat.groupAdmin);
const Adminuser=selectedChat.users.find(u=>u.name === admin[1]);

  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    bg={Adminuser.name===user.name ? "teal" : "purple"}
    fontWeight={Adminuser.name===user.name ? "700" : ""}
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    >
        {Adminuser.name===user.name ? `${user.name} (admin)` : `${user.name}`}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem
