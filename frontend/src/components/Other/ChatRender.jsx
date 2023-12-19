import React, { useEffect } from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, FormControl, IconButton, Text, useToast} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender, getFullSender} from '../../logic';
import ProfileModal from './profileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import {Input} from '@chakra-ui/react';
import axios from 'axios';



const ChatRender = (fetchAgain, setFetchAgain) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(null);
    const toast = useToast();


    const sendMessage = async (e) => {
      if (e.key === "Enter" && newMessage) {
        setNewMessage("");
        try{
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} =  await axios.post("/api/message", {content: newMessage, chatId: selectedChat._id}, config);
        console.log(data);
        setMessages((prev) => [...prev, data]);
      }catch(error){
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  }

    const fetchMessages = async () => {
      if (!selectedChat) return;
      setLoading(true);
      try{
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
      };
      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
      console.log(data);
      setMessages(data);
      setLoading(false);
    }catch(error){
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
  fetchMessages();
},[selectedChat]);


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
          position="relative"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="auto"
          >
          
          <div>
            { /* Messages */}
          </div>
          <FormControl 
          position="absolute"
          bottom="0"
          width="95%"
          onKeyDown={sendMessage} 
          isRequired 
          mb={3}
          >
            <Input
              placeholder="Type here..."
              variant="filled"
              bg = "E0E0E0"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
