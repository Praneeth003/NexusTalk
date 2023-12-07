import React, { useState } from 'react';
import { Avatar, Button, Box, Input, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from '../Other/profielModal';
import { ChatState } from '../../Context/ChatProvider';
import {useNavigate } from 'react-router-dom';
import { useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from '../Other/UserListItem';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]); 

  const {user, setSelectedChat, chatList, setChatList} = ChatState();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSearch = async() => {
    if(!search){
      toast({
        title: "Please enter a name or an email",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setSearchResult(data);
    }catch(error){
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });
    }
  };

  const logoutHandler = () => {
    // Perform logout logic here
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = (UserId) => {
    console.log(UserId);
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = axios.post(`/api/chat`, {UserId}, config);
      console.log(data);
      
      const chatExists = chatList.find((chat) => chat._id === data._id);
      if(!chatExists){
        setChatList((prevState) => [...prevState, data]);
      }

      setSelectedChat(data);
      onClose();
  }
  catch(error){
    toast({
      title: "Error in accessing chat",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-left"
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
    <Tooltip hasArrow label='Search Users' bg='gray.300' color='black' Placement="right-end">
      <Button variant="outline" colorScheme="blue" leftIcon={<SearchIcon />} onClick={onOpen}>
        Search Users
      </Button>
    </Tooltip>

    <Text p = "0" b ="0" m = "0" fontSize="3xl" color = "black" textAlign="center">NexusTalk</Text>

    <div>
    <Menu>
      <MenuButton>
        <BellIcon fontSize = "2xl"/>
      </MenuButton>
    </Menu>
    <Menu>
        <MenuButton ml = "5px" as={Button} rightIcon={<ChevronDownIcon />}>
        <Avatar size = "sm" src = "https://images.immediate.co.uk/production/volatile/sites/3/2023/08/2023.06.28-06.20-boundingintocomics-649c79f009cdf-Cropped-8d74232.png?resize=768,574" />
        </MenuButton>
      <MenuList>
        <ProfileModal user={user}>
        <MenuItem>My Profile</MenuItem>
        </ProfileModal>
        <MenuItem onClick = {logoutHandler}>Logout</MenuItem>
      </MenuList>
    </Menu>
    </div>
    </Box>
    <Drawer placement='left' onClose = {onClose} isOpen = {isOpen} >
    <DrawerOverlay /> 
    <DrawerContent>
    <DrawerHeader borderBottomWidth='1px' display="flex" alignItems="center" justifyContent="center" >Search Users</DrawerHeader>
    <DrawerBody>
    <Box d = "flex">
      <Input placeholder = "Search by Name or Email" value = {search} onChange={(event) => setSearch(event.target.value)} />
      <Button onClick={handleSearch}>Search</Button>
    </Box>

    {searchResult?.map((user) => (
      <UserListItem
      key = {user._id}
      user = {user}
      handleFunction={() => accessChat(user._id)}
      />
    ))}
    
    </DrawerBody>
    </DrawerContent>
    </Drawer>
    
</>
  );
};

export default SideDrawer;
