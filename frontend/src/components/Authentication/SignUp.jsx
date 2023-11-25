import React, { useState } from "react";
import {FormControl, FormLabel, vStack, Input, InputRightElement, InputGroup, Button, useToast} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp(){
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: "",
        
    });
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();

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
        //Warn to let the user fill all the details
        const { name, email, password, confirmPassword, profilePicture } = state;
        event.preventDefault();
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: "6000",
                position: "bottom",
                isClosabale: "true" 
            });
        }
        if(password !== confirmPassword){
            toast({
                title: "Passwords do not match!",
                status: "error",
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
            await axios.post("api/user", {name, email, password, profilePicture},
            config);
            toast({
                title: "Registration is Successful!",
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
        setState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePicture: "",
    });
    }
        

    return(
        <vStack>
            
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                    <Input name ="name" placeholder = "Enter Your Name" value = {state.name} onChange = {recordInput} /> 
            </FormControl>

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

            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                    <Input name = "confirmPassword" placeholder = "Confirm Password" value = {state.confirmPassword} onChange = {recordInput} 
                        type={showPassword ? "text" : "password"}
                    /> 
                    <InputRightElement>
                        <Button onClick = {handleClick} size ="sm" colorScheme='gray' variant='outline'>{showPassword ? "Hide" : "Show"}</Button>
                    </InputRightElement>  
                    </InputGroup>
            </FormControl>

            <FormControl>
                <FormLabel>Profile Picture </FormLabel>
                <Input type = "file" accept = "image/*" onChange = {recordInput} name = "profilePicture"></Input>
            </FormControl>

            <Button colorScheme = 'blue' width = "100%" onClick = {onSubmit} mt = {5} >
            Sign Up
            </Button>

        </vStack>
    );
}

export default SignUp;