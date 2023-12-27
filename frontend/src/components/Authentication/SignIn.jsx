import React, { useState } from "react";
import {FormControl, FormLabel, Input, Button, InputRightElement, InputGroup, useToast} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

function SignIn(){
    const [state, setState] = useState({
        email: "",
        password: "",
    })
    const toast = useToast();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    function recordInput(event){
        const {name, value} = event.target;
        setState((prevValue =>{
            return{
            ...prevValue,
            [name] : value
        };})
        );
    }

    function handleClick(){
        setShowPassword(!showPassword);
    }

    async function onSubmit(event){
        const {email, password} = state;
        if(!email || !password){
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 3000,
                position: "bottom",
                isClosabale: true 
            });
        }
        else{
        try{
            const config ={
                headers:{
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post(
                "/api/user/login", {email,password}, config
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast({
                title: "Logged In Successfully!",
                position: "bottom",
                duration: 3000,
                isClosable: true,
                status: "success"
            });
            navigate('/chat');
        }catch(error){
            console.log(error);
            toast({
                title: "Error Occured",
                description: `${error.response.data}`,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
        }

    }

    return(
        <vStack>
            
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                    <Input name ="email" placeholder = "Enter Your Email Address" value = {state.email} onChange = {recordInput} /> 
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                    <InputGroup>
                    <Input name ="password" placeholder = "Enter Password" value = {state.password} onChange = {recordInput} 
                        type={showPassword ? "text" : "password"}
                    /> 
                    <InputRightElement>
                        <Button onClick = {handleClick} size ="sm" colorScheme='gray' variant='outline' >{showPassword ? "Hide" : "Show"}</Button>
                    </InputRightElement>  
                    </InputGroup>
            </FormControl>

            <Button colorScheme = 'blue' width = "100%" variant = 'outline' onClick = {onSubmit} mt = {5} >
            Sign In
            </Button>

        </vStack>
    );
}

export default SignIn;