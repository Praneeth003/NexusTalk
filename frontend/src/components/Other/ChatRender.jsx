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

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const ChatRender = (fetchAgain, setFetchAgain) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
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
      socket.emit("join chat", selectedChat._id);
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
  selectedChatCompare = selectedChat;
},[selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if(!selectedChatCompare || newMessageReceived.chat._id !== selectedChatCompare._id){
        //Notification
      }
      else{
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });
  });
  
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
          <UpdateGroupChatModal fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain} fetchMessages = {fetchMessages}/>
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
          
          <div className = "messages">
            <ScrollableChat messages = {messages} />
          </div>
          <FormControl 
          position="fixed"
          bottom="0"
          width="100%"
          onKeyDown={sendMessage} 
          isRequired 
          mb={3}
          ml={0}
          mt={10}
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
