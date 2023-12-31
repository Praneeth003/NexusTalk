import React, { useEffect, useState } from "react";
import axios from "axios"; 
import {ChatState} from "../../Context/ChatProvider";
import SideDrawer from "../UiComponents/SideDrawer";
import MyChats from "../UiComponents/MyChats";
import ChatBox from "../UiComponents/ChatBox";
import { Box } from "@chakra-ui/react";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL || "http://localhost:4000";

function Chat(){
    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

   return (
    <div style={{width: "100%"}}>
    {user && <SideDrawer />}
    <Box 
      style={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "90vh",
    padding: "10px",
    width: "100%",
    flexWrap: "nowrap",
  }}
    >
    {user && <MyChats  fetchAgain={fetchAgain}/>}
    {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain}/>}
    </Box>
    </div>
);
}

export default Chat;