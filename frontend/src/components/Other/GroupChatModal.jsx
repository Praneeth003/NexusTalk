import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button, 
  useDisclosure,
  FormControl,
} from '@chakra-ui/react';
import {useState} from 'react';
import {useToast} from '@chakra-ui/react';
import {ChatState} from '../../Context/ChatProvider';
import {Input} from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from './UserListItem';

const GroupChatModal = ({children}) => {
  // Add your component logic here
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const toast = useToast();
  const {user, chatList, setChatList} = ChatState();
  

 const handleSearch =  async (val) => {
    setSearch(val);
    if(!val){
        return;
    }
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            };
            const {data} = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setSearchResults(data);
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

    // Add your search logic here
    };
 
    const handleSubmit = async () => {
    };

    const handleSelect = (i) => {
        setSelectedUsers([...selectedUsers, i]);
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily='Work Sans'
            fontWeight='bold'
            fontSize='2xl'
            textAlign='center'
            color='blue.500'
          >Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d = 'flex'
            flexDir = 'column'
            justifyContent = 'center'
            alignItems = 'center'
          >
          <FormControl>
          <Input placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />  
          </FormControl>

        <FormControl>
        <Input placeholder="search for users" value={search} onChange={(e) => handleSearch(e.target.value)} />
        </FormControl>
          
          {searchResults.map((i) => (
            <UserListItem
              key={i._id}
              i={i}
              handleFunction={() => handleSelect(i)}
            />
          ))}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};

export default GroupChatModal;
