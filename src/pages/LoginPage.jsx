import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import Toolbar from "../components/Toolbar";
import {setUser} from "../features/vars";

const LoginPage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [error, setError] = useState("")
    const usernameRef = useRef()
    const pass1Ref = useRef()
    const checkRef = useRef()
    const toPage = useNavigate()

    function saveAutologin() {
        const auto = checkRef.current.checked
        localStorage.setItem("autologin", auto)
    }

    function send(auto = false) {
        const user = {
            username: usernameRef.current.value,
            pass1: pass1Ref.current.value,
        }

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        }

        fetch("/api/login", options)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setError("")
                    dispatch(setUser(data.data))
                    localStorage.setItem("token", data.data.token);
                    toPage("/profile")
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
            <input type="password" ref={pass1Ref} placeholder="Password"/>
            <div className="d-flex gap10 j-center">
                <label htmlFor="auto">autologin</label>
                <input ref={checkRef} id="auto" onChange={saveAutologin} type="checkbox"/>
            </div>
            <button onClick={send}>Login</button>
        </div>
    );
};

export default LoginPage;