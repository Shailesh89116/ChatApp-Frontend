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
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider';

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      )}
       <Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader 
          fontSize='40px'
          fontFamily="sans-serif"
          display='flex'
          justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir='column' alignItems="center" justifyContent="space-between">
            <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.pic}></Image>
            <Text fontSize={{base:"28px", md:"30px"}} fontFamily='sans-serif'>
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}  onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    
  )
}

export default ProfileModal
