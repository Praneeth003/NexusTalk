import React from 'react';
import { Badge } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';


const UserBadge = ({u,handleFunction}) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      mt={2}
      mb={2}
      fontSize={12}
      fontFamily={'Trebuchet MS'}
      variant="outline"
      colorScheme="purple"
      cursor="pointer"
      
      onClick={handleFunction}
    >
      {u.name}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadge;
