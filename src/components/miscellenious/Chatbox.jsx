import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { ChatState } from '../../context/ChatProvider'
import SingleChat from '../SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const {selectedChat}=ChatState()

  return (
   <Box display={{base: selectedChat ? "flex" : "none", md:"flex"}}
   width={{base:"100%", md:"68%"}}
   p={3}
   bg="grey"
    alignItems="center"
    flexDir="column"
    borderRadius="lg"
    borderWidth="1px"
   >
    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
   </Box>
  )
}

export default ChatBox
