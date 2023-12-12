import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, IconButton, Text} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender, getFullSender} from '../../logic';
import ProfileModal from './profileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';

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
          (<>
          {getSender(user, selectedChat.users)}
          <ProfileModal user = {getFullSender(user, selectedChat.users)}></ProfileModal>
          </>)
          :
          (
          <>
          {selectedChat.chatName}
          <UpdateGroupChatModal fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>
          </>
          )
          }
          
          </Text>
          <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
          >
          {}
          </Box>
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
