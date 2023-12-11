import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, Text} from '@chakra-ui/react';

const ChatRender = (fetchAgain, setFetchAgain) => {
    const {user, selectedChat, set} = ChatState();
  return (
    <>
      {selectedChat?(
        <></>
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
