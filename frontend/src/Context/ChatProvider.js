import {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const ChatContext = createContext();
 
const ChatProvider =({children}) => {
    // user is for storing the logged in user
    const [user, setUser] = useState();
    // selectedChat is for storing the selected chat of the logged in user
    const [selectedChat, setSelectedChat] = useState();
    // chatList is for storing all the chat list of the logged in user
    const [chatList, setChatList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem("userInfo");
        const foundUser = JSON.parse(loggedInUser);
        setUser(foundUser);
        
        if(!loggedInUser){
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value = {{user, setUser, selectedChat, setSelectedChat, chatList, setChatList }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () =>{
    return useContext(ChatContext);
}

export default ChatProvider;