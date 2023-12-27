import React, { useState } from 'react';
import { Avatar, Button, Box, Input, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from '../Other/profileModal';
import { ChatState } from '../../Context/ChatProvider';
import {useNavigate } from 'react-router-dom';
import { useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../Other/UserListItem';
import { Center } from '@chakra-ui/layout';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { getSender } from '../../logic';
import { set } from 'mongoose';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]); 
  const [loadingChat, setLoadingChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user, setSelectedChat, chatList, setChatList, notification, setNotification} = ChatState();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

   const handleSearch =  async (val) => {
    setSearch(val);
    if(!val){
        return;
    }
    try{
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
    }catch(error){
        toast({
            title: 'Something went wrong',
            description: 'Unable to search',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom-left',
        });
    }
    };

  const logoutHandler = () => {
    // Perform logout logic here
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    console.log(userId);
    setSearch('');
    
    try{
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post(`/api/chat`, {userId}, config);
      console.log(data);

      const chatExists = chatList.find((chat) => chat._id === data._id);
      if(!chatExists){
        setChatList([data, ...chatList]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(error){
      console.log(error);
      toast({
        title: "Error in accessing chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left"
      });
  }}

  return (
    <>
    <Box 
    display = "flex"
    alignItems="center"
    justifyContent="space-between"
    width="100%"
    height="80px"
    padding="1rem"
    bg="gray.200">
    <Tooltip hasArrow fontFamily='Trebuchet MS' label='Add Users' bg='gray.300' color='black' Placement="right-end">
      <Button variant="outline" colorScheme="black" leftIcon={<SearchIcon />} onClick={onOpen} borderWidth="0" fontSize="lg" fontFamily="Trebuchet MS" >
        Search Users to Add Them
      </Button>
    </Tooltip>

    <Text p = "0" b ="0" m = "0" fontSize="3xl" color = "black" fontFamily="Monaco" fontWeight="Bold" textAlign="center">NexusTalk</Text>

    <div>
    <Menu>
      <MenuButton>
        <BellIcon fontSize = "2xl"  color={notification.length !== 0 ? "red" : "black"}/>
      </MenuButton>
      <MenuList fontFamily="Trebuchet MS">
          {!notification.length && 
          <Center>
          No New Messages
          </Center>}
              {notification.map((i) => (
                <MenuItem
                  key={i._id}
                  onClick={() => {
                    setSelectedChat(i.chat);
                    setNotification(notification.filter((n) => n !== i));
                  }}
                >
                  {i.chat.isGroupChat
                    ? `New Message in ${i.chat.chatName}`
                    : `New Message from ${getSender(user, i.chat.users)}`}
                </MenuItem>
              ))}
      </MenuList>
    </Menu>
    <Menu>
        <MenuButton ml = "5px" as={Button} rightIcon={<ChevronDownIcon />}>
        <Avatar size = "sm" src = {user.profilepic} />
        </MenuButton>
      <MenuList>
        <ProfileModal user={user}>
        <MenuItem fontFamily="Trebuchet MS" >My Profile</MenuItem>
        </ProfileModal>
        <MenuItem fontFamily="Trebuchet MS" onClick = {logoutHandler}>Logout</MenuItem>
      </MenuList>
    </Menu>
    </div>
    </Box>
    <Drawer placement='left' onClose = {onClose} isOpen = {isOpen} >
    <DrawerOverlay /> 
    <DrawerContent>
    <DrawerHeader borderBottomWidth='1px' display="flex" alignItems="center" justifyContent="center" fontFamily="Trebuchet MS" >Search Users</DrawerHeader>
    <DrawerBody>
   <Box d="flex" flexDirection="column" alignItems="center">
    <Input 
    placeholder="Search by Name or Email" 
    value={search} 
    onChange={(event) => handleSearch(event.target.value)} 
    borderWidth="1px" 
    borderColor="black"
    />
    {/* <Button  mt={1} ml={185} onClick={handleSearch} borderWidth="1px" borderColor="black" fontFamily="Trebuchet MS">
    Search
    </Button> */}
    </Box>

    {loading ? 
    (<div>Loading...</div>) : 
    (searchResult?.filter(i => i._id !== user._id).map((i) => (
      <UserListItem
      key = {i._id}
      i = {i}
      handleFunction={() => accessChat(i._id)}
      />
    )))}
    
    </DrawerBody>
    </DrawerContent>
    </Drawer>
    
</>
  );
};

export default SideDrawer;
