import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Toolbar from "../components/Toolbar";

const RegPage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [error,setError] = useState("")
    const usernameRef = useRef()
    const pass1Ref = useRef()
    const pass2Ref = useRef()
    const toPage = useNavigate()

    function send() {
        const user = {
            username: usernameRef.current.value,
            pass1: pass1Ref.current.value,
            pass2: pass2Ref.current.value,
        }

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        }

        fetch("/api/register", options)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setError("")
                    toPage("/login")
                } else {
                    setError(data.message)
                }
            })
    }

    return (
        <div className="container d-flex flex-column gap10">
            <Toolbar/>

            <h4 className="text-danger">{error}</h4>
            <input type="text" ref={usernameRef} placeholder="Username"/>
            <input type="password" ref={pass1Ref} placeholder="Password 1"/>
            <input type="password" ref={pass2Ref} placeholder="Password 2"/>
            <button onClick={send}>Register</button>
        </div>
    );
};

export default RegPage;