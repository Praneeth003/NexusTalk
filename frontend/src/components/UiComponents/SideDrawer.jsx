import React, { useState } from 'react';
import { Avatar, Button, Box, Input, InputGroup, InputLeftElement, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProfileModal from '../Other/profielModal';
import { ChatState } from '../../Context/ChatProvider';
import {useNavigate } from 'react-router-dom';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const {user} = ChatState();

  const handleSearch = () => {
    // Perform search logic here based on 'search' state
    // For example:
    // setSearchResult(...);
  };

  const navigate = useNavigate();

  const logoutHandler = () => {
    // Perform logout logic here
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

  return (
    <Box 
    display = "flex"
    alignItems="center"
    justifyContent="space-between"
    width="100%"
    height="80px"
    padding="1rem"
    bg="gray.200">
    <Tooltip hasArrow label='Search Users' bg='gray.300' color='black' Placement = "Right-End">
    <InputGroup maxWidth="150px">
      <InputLeftElement fontSize= "1xl"
        pointerEvents="none"
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        children={<SearchIcon color="blue.900" />}
      />
      <Input fontSize= "1.5xl"
        value={search}
        onChange={handleInputChange}
        placeholder="Search users"
        size="md"
        onKeyDown={handleKeyPress} // Trigger search on Enter key press
        pl="2rem" // Adjust padding-left to accommodate the search icon
        borderRadius="md" // Optional: add border radius for better appearance
      />
    </InputGroup>
    </Tooltip>

    <Text p = "0" b ="0" m = "0" fontSize="2xl" color = "black" textAlign="center">NexusTalk</Text>
    <Menu>
      <MenuButton>
        <BellIcon fontSize = "2xl"/>
      </MenuButton>
    </Menu>
    <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Avatar size = "sm" src = "#" />
        </MenuButton>
      <MenuList>
        <ProfileModal user={user}>
        <MenuItem>My Profile</MenuItem>
        </ProfileModal>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
    
    </Box>
  ); 
};

export default SideDrawer;
