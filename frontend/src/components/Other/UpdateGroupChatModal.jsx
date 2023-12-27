import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Icon, FormControl } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import UserBadge from './UserBadge';
import UserListItem from './UserListItem';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { set } from 'mongoose';
import { Text } from '@chakra-ui/react';


function UpdateGroupChatModal({fetchAgain, setFetchAgain, fetchMessages}){
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();
    
    
    const {user, selectedChat, setSelectedChat} = ChatState();

    const handleRename = async () => {
        if(!groupChatName){
            return;
        }
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
           
            const {data} = await axios.put('/api/chat/rename', {chatId: selectedChat._id, name: groupChatName}, config);
            setSelectedChat(data);
            toast({
                title: 'Group renamed',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            setFetchAgain(!fetchAgain);
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
        setGroupChatName("");
    };

    const handleRemove = async (u) => {
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only admin can remove users',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if(u._id === user._id){
            toast({
                title: 'Admin cannot be removed',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }


        try{
            setLoading(true);
            const config = {
                headers: {          
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put('/api/chat/remove', {chatId: selectedChat._id, userId: u._id}, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
            toast({
                title: 'User removed',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
        }
        catch(error){
            console.log(error);
            toast({
                title: 'Something went wrong',
                description: `${error.response.data.message}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
        // setGroupChatName("");
    };

    const handleLeave = async (u) => {
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put('/api/chat/leave', {chatId: selectedChat._id, userId: u._id}, config);
            setSelectedChat();
            setFetchAgain(!fetchAgain);
            fetchMessages();
            toast({
                title: 'Left group',
                status: 'success',
                duration: 6000,
                isClosable: true,
                position: 'bottom',
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
    }

    const handleAdd = async (u) => {
        if(selectedChat.users.find((x) => x._id === u._id)){
            toast({
                title: 'User is already in the group',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only admin can add users',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put('/api/chat/add', {chatId: selectedChat._id, userId: u._id}, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            
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
            console.log(data);
            setLoading(false);
            setSearchResult(data);
    }catch(error){
        toast({
            title: 'Something went wrong',
            description: 'Unable to search',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom',
        });
    }
    };
    
    return (
        <>
            <IconButton d = {{base: "flex"}} icon = {<ViewIcon/>} onClick = {onOpen}/>
            <Modal isOpen = {isOpen} onClose = {onClose} isCentered>
                <ModalOverlay/>
                <ModalContent border= "1px black solid" bg="#F2F1EB">
                    <ModalHeader fontFamily = "Trebuchet MS" >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text fontFamily = "Trebuchet MS" fontSize = "20px">Group Admin:</Text>
                        <UserListItem i = {selectedChat.groupAdmin} handleFunction={() => {}} />
                        <Text fontFamily = "Trebuchet MS" fontSize = "20px">Group Members:</Text>
                       <Box>
                        {selectedChat.users.map((u) => (
                            <UserBadge u = {u} key = {u._id} handleFunction={() => handleRemove(u)}/>
                        ))}
                       </Box>
                       
                       <FormControl className = "flex-space-between">
                       <Input placeholder = "Rename Group"
                       value = {groupChatName} 
                       style={{ border: '1px solid #000' }}
                       onChange = {(e) => setGroupChatName(e.target.value)}/>
                          <Button colorScheme = "teal" ml={2} onClick = {handleRename}
                          variant="outline"
                          style={{ border: '1px solid #000' }}
                          fontFamily = "Trebuchet MS" >
                          Rename
                          </Button>
                       </FormControl> 

                       <FormControl mt={4}>
                          <Input placeholder = "Add New User"  
                          style={{ border: '1px solid #000' }}
                          value = {search} onChange = {(e) => handleSearch(e.target.value)}/>
                       </FormControl>

                       {loading ? (
                           <Box>
                               Loading...
                           </Box>
                       ):(
                               searchResult?.map((i) => (
                                   <UserListItem i = {i} key = {i._id} handleFunction = {() => handleAdd(i)}/>
                               ))
                       )}
                    </ModalBody>
                    <ModalFooter>
                         <Button style={{ border: '1px solid #000' }} variant = "outline" onClick={() => handleLeave(user)} fontFamily = "Trebuchet MS" colorScheme="red" mr={3}>
                            {selectedChat.groupAdmin._id === user._id ? "Delete Group" : "Leave Group"}
                        </Button>
                        <Button style={{ border: '1px solid #000' }} variant = 'outline' fontFamily = "Trebuchet MS" colorScheme = "yellow" mr = {1} onClick = {onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
    
}

export default UpdateGroupChatModal;