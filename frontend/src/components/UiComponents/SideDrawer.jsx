import React, { useState } from 'react';
import { Box, Input, InputGroup, InputLeftElement, Text, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { SearchIcon, BellIcon } from '@chakra-ui/icons';

const SideDrawer = () => {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    // Perform search logic here based on 'search' state
    // For example:
    // setSearchResult(...);
  };

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
    d = "flex"
    alignItems="center"
    justifyContent="space-around"
    width="100%"
    height="80px"
    bg="gray.200">
    <Tooltip hasArrow label='Search Users' bg='gray.300' color='black' Placement = "Right-End">
    <InputGroup maxWidth="150px">
      <InputLeftElement
        pointerEvents="none"
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        children={<SearchIcon color="blue.900" />}
      />
      <Input
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
    <div><Menu>
      <MenuButton>
        <Text fontSize="2xl" color = "black" textAlign="center">Menu</Text>
      </MenuButton>
      <MenuList>
        <MenuItem>BellIcon</MenuItem>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
    </div>
    </Box>
  ); 
};

export default SideDrawer;
