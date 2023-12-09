import React, { useEffect } from 'react';
import { Box, Text, Button, Stack } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../logic';
import { AddIcon } from '@chakra-ui/icons';

const MyChats = (fetchAgain) => {
  const { user, chatList, selectedChat, setSelectedChat,setChatList } = ChatState();
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
        description: 'Unable to fetch chats',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    const foundUser = JSON.parse(loggedInUser);
    setLoggedInUser(foundUser);
    fetchChats();
  },[fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
    <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
      My Chats
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
      
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
      {chatList ? 
          <Stack overflowY="scroll" height = "90vh">
            {chatList.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedInUser, chat.users)
                    : chat.chatName}
                </Text>
                
              </Box>
            ))}
          </Stack> : null
      }
      </Box>
    </Box>
  );
};

export default MyChats;
