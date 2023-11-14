import React from "react";
import { Container, Box, Text} from "@chakra-ui/react";

function Home(){
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
        </Container>
    );
}

export default Home;