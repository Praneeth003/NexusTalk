import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Icon, FormControl } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import UserBadge from './UserBadge';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import UserListItem from './UserListItem';
import { set } from 'mongoose';


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
                position: 'bottom-left',
            });
            setFetchAgain(!fetchAgain);
        }catch(error){
            toast({
                title: 'Something went wrong',
                description: 'Unable to rename group',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',

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
                position: 'bottom-left',
            });
            return;
        }
        if(u._id === user._id){
            toast({
                title: 'Admin cannot be removed',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
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
                position: 'bottom-left',
            });
        }
        catch(error){
            toast({
                title: 'Something went wrong',
                description: 'Unable to remove user',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
            });
            setLoading(false);
        }
        // setGroupChatName("");
    };

    const handleLeave = async (u) => {
        if(selectedChat.groupAdmin._id === user._id){
            toast({
                title: 'Admin cannot leave the group',
                status: 'error',
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
            const {data} = await axios.put('/api/chat/leave', {chatId: selectedChat._id, userId: u._id}, config);
            setSelectedChat();
            setFetchAgain(!fetchAgain);
            fetchMessages();
            toast({
                title: 'Left group',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
            });
        }catch(error){
            toast({
                title: 'Something went wrong',
                description: 'Unable to leave group',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
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
                position: 'bottom-left',
            });
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only admin can add users',
                status: 'error',
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
            const {data} = await axios.put('/api/chat/add', {chatId: selectedChat._id, userId: u._id}, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            
        }catch(error){
            toast({
                title: 'Something went wrong',
                description: 'Unable to add user',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left',
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
            position: 'bottom-left',
        });
    }
    };
    
    return (
        <>
            <IconButton d = {{base: "flex"}} icon = {<ViewIcon/>} onClick = {onOpen}/>
            <Modal isOpen = {isOpen} onClose = {onClose} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                       <Box>
                        {selectedChat.users.map((u) => (
                            <UserBadge u = {u} key = {u._id} handleFunction={() => handleRemove(u)}/>
                        ))}
                       </Box>
                       
                       <FormControl className = "flex-space-between">
                       <Input placeholder = "New Group Name" value = {groupChatName}   onChange = {(e) => setGroupChatName(e.target.value)}/>
                          <Button colorScheme = "teal" ml={2} onClick = {handleRename} >
                          Rename
                          </Button>
                       </FormControl> 

                       <FormControl mt={4}>
                          <Input placeholder = "Add new user"  value = {search} onChange = {(e) => handleSearch(e.target.value)}/>
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
                         <Button onClick={() => handleLeave(user)} colorScheme="red" mr={3}>
                            Leave Group
                        </Button>
                        <Button colorScheme = "blue" mr = {1} onClick = {onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
    
}

export default UpdateGroupChatModal;