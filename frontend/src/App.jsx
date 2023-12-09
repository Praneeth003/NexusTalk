import React from "react";
import { Route, Routes} from "react-router-dom"; 
import Home from "./components/Pages/Home.jsx";
import Chat from "./components/Pages/Chat.jsx";

function App(){
  return(  
    <div>
    <Routes>
        <Route path="/" exact element = {<Home />} />
        <Route path="/chat" exact element={<Chat />} />
    </Routes>
    </div>   
  )

}
export default App;