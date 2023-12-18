import React from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, FormControl, IconButton, Text} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender, getFullSender} from '../../logic';
import ProfileModal from './profileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import {Input} from '@chakra-ui/react';


const ChatRender = (fetchAgain, setFetchAgain) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(null);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    };

    const sendMessage = async (e) => {
      if (e.key === "Enter" && newMessage) {
        try{
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} =  
        
      }
    };

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
          <div>
            { /* Messages */}
          </div>
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            <Input
              placeholder="Type here..."
              variant="filled"
              bg = "E0E0E0"
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
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
