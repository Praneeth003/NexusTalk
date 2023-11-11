import React from "react";
import {Route, Routes} from "react-router-dom"; 
import Home from "./components/Home";
import Chat from "./components/Chat";

function App(){
  return(
    <div>
    <Routes>
        <Route path="/" element = {<Home />} />
        <Route path="/chats" element={<Chat />} />
        </Routes>
    </div>
        
  )

}
export default App;