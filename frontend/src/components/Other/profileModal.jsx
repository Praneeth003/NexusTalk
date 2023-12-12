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
import { ViewIcon } from '@chakra-ui/icons';

function ProfileModal({user, children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {/* If children are passed, then the modal will be opened by clicking on the children. Otherwise, the modal will be opened by clicking on the icon. */}
    {
        children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton d ={{base: "flex"}} icon ={<ViewIcon/>} onClick={onOpen}/>)
    }
        <Modal isOpen={isOpen} onClose={onClose} size = "xl">
            <ModalOverlay />
            <ModalContent>
            <ModalHeader fontSize="25px">{user.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody align="center" justify="center" >
            <img src = "https://images.immediate.co.uk/production/volatile/sites/3/2023/08/2023.06.28-06.20-boundingintocomics-649c79f009cdf-Cropped-8d74232.png?resize=768,574" alt = "" style = {{width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover"}}/>
            <p style = {{fontSize : "20px", margin : "5px"}}>{user.email}</p>
            </ModalBody>
    
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  );
    
};

export default ProfileModal;