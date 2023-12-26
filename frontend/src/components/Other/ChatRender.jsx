import React, { useEffect } from 'react';
import {ChatState} from '../../Context/ChatProvider';
import {Box, FormControl, IconButton, Text, useToast} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender, getFullSender} from '../../logic';
import ProfileModal from './profileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import {Input} from '@chakra-ui/react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client";
import { Flex } from '@chakra-ui/layout';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const ChatRender = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState(null);
    const toast = useToast();
    const [socketConnected, setSocketConnected] = React.useState(false);

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
        socket.emit("new message", data);
        setMessages([...messages, data]);
      }catch(error){
        toast({
          title: "Error",
          description: `${error.response.data}`,
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
      socket.emit("join chat", selectedChat._id);
    }catch(error){
      toast({
        title: "Error",
        description: `${error.response.data}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
  socket = io(ENDPOINT);
  socket.emit("setup", user);
  socket.on("connected", () => setSocketConnected(true));
}, []);

  useEffect(() => {
  fetchMessages();
  selectedChatCompare = selectedChat;
},[selectedChat]);

   useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  
  return (
    <>
      {selectedChat?(
        <>
          <Flex
          fontSize={{base: "28px", md: "30px"}}
          fontFamily="Trebuchet MS"
          pb={3}
          w = "100%"
          justifyContent="space-between"
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
          <UpdateGroupChatModal fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain} fetchMessages = {fetchMessages}/>
          </>
          )
          }      
          </Flex>

          <Box
          position="relative"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="72vh"
          borderRadius="lg"
          overflowY="auto"
          >
          
          <div className = "messages">
            <ScrollableChat messages = {messages} />
          </div>
          <FormControl 
          position="fixed"
          bottom="0"
          width="63%"
          onKeyDown={sendMessage} 
          isRequired 
          mb={5}
          ml={0}
          mt={1}
          >
            <Input
              placeholder="Enter your message"
              variant="filled"
              bg = "E0E0E0"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              border="1px solid black"
            />
          </FormControl>
          </Box>
        </>
      ):(
      <Box
        style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }}
        >
        <Text
          fontSize="3xl"
          pb={3}
          fontFamily="Work sans"
          >
          Select a chat to start chatting!!</Text>
      </Box>)
      }
    </>
  );
};

export default ChatRender;
