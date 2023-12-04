import React, { useEffect, useState } from "react";
import axios from "axios"; 
import {chatState} from "../Context/ChatProvider";

axios.defaults.baseURL = 'http://localhost:4000';

function Chat(){
    const {user} = chatState();

   return (
    <div style={{width: "100%"}}>

    </div>
);
}

export default Chat;