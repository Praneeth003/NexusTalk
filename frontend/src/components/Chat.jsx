import React, { useEffect, useState } from "react";
import axios from "axios"; 

axios.defaults.baseURL = 'http://localhost:4000';
function Chat(){
    const [chatData, setChatData] = useState(null);
    
  async function fetchChatData() {
    try {
        const response = await axios.get("/api/chat");
        console.log(response);
    } catch (error) {
        console.error("Error fetching chat data:", error);
    }
  }
  useEffect(() => {
    fetchChatData();
    }, []);
   return (
    <div>
        
    </div>
);
}

export default Chat;