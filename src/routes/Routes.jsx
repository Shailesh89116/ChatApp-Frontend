
import { ChakraProvider } from '@chakra-ui/react';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import ChatPage from '../pages/ChatPage';


export default createBrowserRouter([
    {
      path: "/",
      element: <ChakraProvider>
      <LoginPage/>
      </ChakraProvider>,
    },
    {
      path: "/chats",
      element: <ChakraProvider>
      <ChatPage/>
      </ChakraProvider>,
    },
  ])