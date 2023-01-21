import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";

const LoginPage = () => {

    const navigate=useNavigate();
    
    useEffect(()=>{
      const user=JSON.parse(localStorage.getItem('userInfo'));
      if(user){
        navigate("/chats");
      }
    },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="work sans"
          color="black"
          textAlign="center"
        >
          React Chat App
        </Text>
      </Box>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList marginBottom='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {<Login/>}
            </TabPanel>
            <TabPanel>
              {<SignUp/>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default LoginPage;
