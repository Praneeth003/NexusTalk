import {createContext, useContext, useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";

const ChatContext = createContext();
 
const ChatProvider =({children}) => {
    const [user, setUser] = useState();
    const history = useHistory();
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser){
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
        if(!loggedInUser){
            history.push("/");
        }
    }, [history]);

    return (
        <ChatContext.Provider value = {{user, setUser}}>
            {children}
        </ChatContext.Provider>
    );
};

export const chatState = () =>{
    return useContext(ChatContext);
}


export default ChatProvider;