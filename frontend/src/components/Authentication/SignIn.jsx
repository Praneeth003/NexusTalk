import React, { useState } from "react";
import {FormControl, FormLabel, Input, Button, InputRightElement, InputGroup} from "@chakra-ui/react";

function SignIn(){
    const [state, setState] = useState({
        email: "",
        password: "",

    })

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

    function onSubmit(event){
        //Implement later
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