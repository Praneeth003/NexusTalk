import React from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';

// This component is used in the SideDrawer component to display cards for the users that are searched for
const UserListItem = ({ i, handleFunction }) => {

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={i.name}
        src={i.profilepic}
      />
      <Box>
        <Text>{i.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {i.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;