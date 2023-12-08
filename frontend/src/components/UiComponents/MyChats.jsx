import React, { useEffect } from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const MyChats = () => {
  const { user, chatList, setSelectedChat,setChatList } = ChatState();
  const [loggedInUser, setLoggedInUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      console.log(data);
      setChatList(data);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    const foundUser = JSON.parse(loggedInUser);
    setLoggedInUser(foundUser);
    fetchChats();
  },[]);

  return (
    <Box>
      

    </Box>
  );
};

export default MyChats;
