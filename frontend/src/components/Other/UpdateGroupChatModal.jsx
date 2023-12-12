import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Icon, FormControl } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import UserBadge from './UserBadge';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Input } from '@chakra-ui/react';
import axios from 'axios';
import { Toast } from '@chakra-ui/react';


function UpdateGroupChatModal({fetchAgain, setFetchAgain}){
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    
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
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        }catch(error){
            Toast({
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
    const handleRemove = async () => {
    };
    const handleSearch = async (search) => {
    };
    const handleAdd = async (user) => {
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
                            <UserBadge u = {u} key = {u._id} handleFunction={handleRemove(u)}/>
                        ))}
                       </Box>
                       
                       <FormControl d = 'flex'>
                       <Input placeholder = "New Group Name" value = {groupChatName} onChange = {(e) => setGroupChatName(e.target.value)}/>
                          <Button colorScheme = "teal" ml = {3} onClick = {handleRename} >
                          Rename
                          </Button>
                       </FormControl> 

                       <FormControl>
                          <Input placeholder = "Add new user"  onChange = {(e) => handleSearch(e.target.value)}/>
                       </FormControl>

                       {loading ? (
                           <Box>
                               Loading...
                           </Box>
                       ):(
                           <Box>
                               {searchResult.map((u) => (
                                   <UserBadge u = {u} key = {u._id} handleFunction = {handleAdd(u)}/>
                               ))}
                           </Box>
                       )}
                    </ModalBody>
                    <ModalFooter>
                         <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                        <Button colorScheme = "blue" mr = {3} onClick = {onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
    
}

export default UpdateGroupChatModal;