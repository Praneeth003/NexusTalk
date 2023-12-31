import React, { useEffect } from 'react';
import { Box, Text, Button, Stack } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../logic';
import { AddIcon } from '@chakra-ui/icons';
import GroupChatModal from '../Other/GroupChatModal';

const MyChats = ({fetchAgain}) => {
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
      className="myBox"
    >
    <Box
        className='mychats'
      >
      <Text className='text'>My Chats</Text>
      <GroupChatModal>
      <Button
        d="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
      >
      New Group 
      </Button>
      </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="79vh"
        borderRadius="lg"
        overflowY="auto"
      >
      {chatList ? 
          <Stack overflowY="scroll" maxHeight = "100%">
            {chatList.map((chat) => (
              chat && <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#9DB2BF" : "#E8E8E8"}
                color="black"
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                fontFamily="Trebuchet MS"
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
