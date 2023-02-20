import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Toast, VStack } from '@chakra-ui/react'
import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [show,setShow]=useState(false);
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const [picLoading, setPicLoading] = useState(false);

    const toast=useToast();
    const navigate=useNavigate();
  
    const handleClick=()=>{
        setShow(!show)
    }

    const submitHandler=async()=>{
        setPicLoading(true);
        
        if (!email || !password) {
            toast({
              title: "Please Provide both Credentails",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
            return;
          }
          try {
            const config = {
              headers: {
                "content-type": "application/json",
              },
            };
          const{ data} = await axios.post("http://13.234.77.255:5000/api/user/login",
              { email,password},
              config
            );
          const user=JSON.stringify(data);
          
          if(user){
            navigate("/chats");
            toast({
              title: "Logged In",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
            localStorage.setItem("userInfo",JSON.stringify(data));
        
            setPicLoading(false);
          }        
          }
          catch (error) {
            toast({
              title: "Error Occured",
              description: error.response.data.message,
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
            return;
          }

    }
  return (
    <VStack spacing='5px'>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
            <Input type={show?'type':'password'} placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show?'hide':'show'}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler}>Login</Button>
        <Button colorScheme='red' width='100%' style={{marginTop:15}} onClick={()=>{
            setEmail('guest@example.com');
            setPassword('123456')
        }}>Get Guest User Credentials</Button>
        
  
</VStack>
  )
}

export default Login
