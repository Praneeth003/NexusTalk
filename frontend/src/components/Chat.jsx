import React, { useEffect, useState } from "react";
import axios from "axios"; 
import {ChatState} from "../Context/ChatProvider";
import SideDrawer from "./UiComponents/SideDrawer";
import MyChats from "./UiComponents/MyChats";
import ChatBox from "./UiComponents/ChatBox";
import { Box } from "@chakra-ui/react";

axios.defaults.baseURL = 'http://localhost:4000';

function Chat(){
    const {user} = ChatState();

   return (
    <div style={{width: "100%"}}>
    {user && <SideDrawer />}
    <Box d = "flex" justifyContent = "space-between" alignItems = "center" h = "95vh">
    {user && <MyChats />}
    {user && <ChatBox />}
    </Box>
    </div>
);
}

export default Chat;