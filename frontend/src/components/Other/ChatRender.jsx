import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, IconButton, Text} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender} from '../../logic';

const ChatRender = (fetchAgain, setFetchAgain) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
  return (
    <>
      {selectedChat?(
        <>
          <Text
          fontSize={{base: "28px", md: "30px"}}
          fontFamily="Work sans"
          pb={3}
          w = "100%"
          d="flex"
          justifyContent={{base: "space-between"}}
          alignItems = "center">
          <IconButton
          d = {{base: "flex", md: "none"}}
          icon = {<ArrowBackIcon/>}
          onClick={() => setSelectedChat("")} />
          
          {!selectedChat.isGroupChat ?
          (<>{getSender(user, selectedChat.users)}</>)
          :
          selectedChat.chatName}
          
          </Text>
        </>
      ):(
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        h="100%"
        >
        <Text
          fontSize="3xl"
          pb={3}
          fontFamily="Work sans"
          >
          Select a chat to start chatting!</Text>
      </Box>)
      }
    </>
  );
};

export default ChatRender;
