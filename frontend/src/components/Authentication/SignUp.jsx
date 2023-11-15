import React, { useState } from "react";
import {FormControl, FormLabel, vStack, Input, InputRightElement, InputGroup, Button} from "@chakra-ui/react";

function SignUp(){
    const [state, setState] = useState({
        name: "",
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
                        <Button onClick = {handleClick} size ="sm" colorScheme='gray' >{showPassword ? "Hide" : "Show"}</Button>
                    </InputRightElement>  
                    </InputGroup>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                    <Input name =" confirmPassword" placeholder = "Confirm Password" value = {state.confirmPassword} onChange = {recordInput} 
                        type={showPassword ? "text" : "password"}
                    /> 
                    <InputRightElement>
                        <Button onClick = {handleClick} size ="sm" colorScheme='gray'>{showPassword ? "Hide" : "Show"}</Button>
                    </InputRightElement>  
                    </InputGroup>
            </FormControl>

        </vStack>
    );
}

export default SignUp;