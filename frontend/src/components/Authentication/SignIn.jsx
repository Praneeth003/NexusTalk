import React, { useState } from "react";
import {FormControl, FormLabel, Input, Button, InputRightElement, InputGroup, useToast} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                duration: "6000",
                position: "bottom",
                isClosabale: "true" 
            });
        }
        try{
            const config ={
                headers:{
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post(
                "api/user/login", {email,password}, config
            );
            toast({
                title: "Logged In Successfully!",
                position: "bottom",
                duration: 6000,
                isClosable: true,
                status: "success"
            });
            navigate('/Chat');
        }catch(error){
            console.log(error);
            toast({
                title: "Error Occured",
                status: "error",
                duration: 6000,
                isClosable: true,
                position: "bottom",
            });
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

            <Button colorScheme = 'blue' width = "100%" onClick = {onSubmit} mt = {5} >
            Sign In
            </Button>

        </vStack>
    );
}

export default SignIn;