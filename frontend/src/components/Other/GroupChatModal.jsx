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
  Box,
} from '@chakra-ui/react';
import {useState} from 'react';
import {useToast} from '@chakra-ui/react';
import {ChatState} from '../../Context/ChatProvider';
import {Input} from '@chakra-ui/react';
import axios from 'axios';
import UserListItem from './UserListItem.jsx';
import UserBadge from './UserBadge.jsx';

const GroupChatModal = ({children}) => {

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const toast = useToast();
  const {user, chatList, setChatList} = ChatState();
  const [loading, setLoading] = useState(false);
  

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
    };
 
    const handleSubmit = async () => {
        if(!groupName){
            toast({
                title: 'Please enter a group name',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
            });
            return;
        }
            try{
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const {data} = await axios.post('/api/chat/group', {name: groupName, users: JSON.stringify(selectedUsers.map((u) => u._id))}, config);
                console.log(data);
                setChatList([...chatList, data]);
                onClose();
                toast({
                    title: 'Group created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-left',
                });
            }catch(error){
                toast({
                    title: 'Something went wrong',
                    description: `${error.response.data.message}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom',
                });
            }
        };
        
    const handleDelete = (i) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== i._id));
    };

    const handleSelect = (i) => {
        console.log(selectedUsers);
        if(selectedUsers.includes(i)){
            toast({
                title: 'User already selected',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
            });
          return;
        }
        else{
        setSelectedUsers([...selectedUsers, i]);
        }
        console.log(selectedUsers);
    };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#F2F1EB">
          <ModalHeader
            fontFamily='Trebuchet MS'
            fontWeight='bold'
            fontSize='2xl'
            textAlign='center'
            color='black'
          >Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d = 'flex'
            flexDir = 'column'
            justifyContent = 'center'
            alignItems = 'center'
          >
          <FormControl pb={2}>
          <Input placeholder="Group Name" value={groupName} style={{ border: '1px solid #000', fontFamily: 'Arial' }} onChange={(e) => setGroupName(e.target.value)} />  
          </FormControl>

        <FormControl>
        <Input placeholder="Search for users" value={search} style={{ border: '1px solid #000', fontFamily: 'Arial' }} onChange={(e) => handleSearch(e.target.value)} />
        </FormControl>

        <Box w="100%" d="flex" flexWrap="wrap">
        {selectedUsers.map((u) => (
            <UserBadge key={u._id} u={u} handleFunction = {() => handleDelete(u)}/>
        ))}
        </Box>
          {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResults?.filter(i => i._id !== user._id).map((i) => (
                  <UserListItem
                    key={i._id}
                    i={i}
                    handleFunction={() => handleSelect(i)}
                  />
                ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={handleSubmit} variant = 'outline' fontFamily="Trebuchet MS" size = 'lg' >
                Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
};


export default GroupChatModal;
