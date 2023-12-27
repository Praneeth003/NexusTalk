import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import ChatRender from '../Other/ChatRender';
import {Box} from '@chakra-ui/react';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
   <Box className={selectedChat ? "chatBoxActive" : "chatBox"}>
      <ChatRender fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain} />

    </Box>
  );
};

export default ChatBox;
