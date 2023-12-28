import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure, Button, IconButton, Center
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

function ProfileModal({user, children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {/* If children are passed, then the modal will be opened by clicking on the children. Otherwise, the modal will be opened by clicking on the icon. */}
    {
        children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton d ={{base: "flex"}} icon ={<InfoIcon/>} onClick={onOpen}/>)
    }
        <Modal isOpen={isOpen} onClose={onClose} size = "xl">
            <ModalOverlay />
            <ModalContent>
            <ModalHeader align="center" fontFamily='Trebuchet MS' fontSize="25px">{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody align="center" justify="center" >
            <img src = {user.profilepic} alt = "" style = {{width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover"}}/>
            <p style = {{fontSize : "20px", margin : "5px", fontFamily: 'Trebuchet MS'}}>{user.email}</p>
            </ModalBody>
    
            <ModalFooter>
                <Button colorScheme="yellow" variant='outline' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  );
    
};

export default ProfileModal;
