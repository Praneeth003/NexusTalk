import React from "react";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import SignIn from "../Authentication/SignIn";
import SignUp from "../Authentication/SignUp";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";

function Home(){
    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
        if (loggedInUser){
            navigate("/chat");
        }
        },[navigate]);
    return(
        <Container maxW = 'xl' centerContent>
            <Box
            d = "flex"
            justifyContent="center"
            p = {3}
            bg = "rgba(176, 217, 177)"
            w = "100%"
            m = "40px 0 15px 0"
            borderRadius = "1g"
            borderWidth = "1px"
            >
                <Text fontSize="4xl" color = "black" textAlign="center">NexusTalk</Text>
            </Box>
            <Box
            p = {4}
            bg = "white"
            w = "100%"
            borderRadius = "1g"
            borderWidth = "1px"
            >
            <Tabs size='md' variant='enclosed'>
                <TabList>
                    <Tab>Sign In</Tab>
                    <Tab>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                    <SignIn/>
                    </TabPanel>
                    <TabPanel>
                    <SignUp/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            </Box>
        </Container>
    );
}

export default Home;