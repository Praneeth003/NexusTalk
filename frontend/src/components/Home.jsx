import React from "react";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import {useHistory} from "react-router-dom";

function Home(){
    const history = useHistory();
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser){
            history.push("/chat");
        }
        },[history]);
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