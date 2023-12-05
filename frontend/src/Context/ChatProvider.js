import {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const ChatContext = createContext();
 
const ChatProvider =({children}) => {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem("userInfo");
        if (loggedInUser){
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
        if(!loggedInUser){
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value = {{user, setUser}}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () =>{
    return useContext(ChatContext);
}


export default ChatProvider;