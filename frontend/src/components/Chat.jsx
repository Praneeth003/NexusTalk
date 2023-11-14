import React, { useEffect, useState } from "react";
import axios from "axios"; 

axios.defaults.baseURL = 'http://localhost:4000';
function Chat(){
    const [chatData, setChatData] = useState([]);
    
    async function fetchChatData() {
        try {
        const response = await axios.get("/api/chat");
        console.log(response.data);
        setChatData(response.data);
        } catch (error) {
        console.error("Error fetching chat data:", error);
        }
    }
    console.log(chatData);
    useEffect(() => {
    fetchChatData();
    }, []);
  
   return (
    <div>
    {chatData.map(i => {
        return <div key = {i._id} > {i.chatName} </div>}
    )
    }
    </div>
);
}

export default Chat;