import React, {useState, useEffect, useRef} from 'react';
import Toolbar from "../components/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedUser, setUniqueUsers, setUserMessages} from "../features/vars";
import {Button} from "react-bootstrap";
import ChatMessage from "../components/ChatMessage";

const MessagesPage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const messageRef = useRef()

    useEffect(() => {
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                authorization: localStorage.getItem("token")
            }
        }

        fetch("/api/uniqueUsers", options)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    dispatch(setUniqueUsers(data.data.uniqueUsers))
                }
            })

        dispatch(setSelectedUser(""))
        dispatch(setUserMessages([]))
    }, []);

    async function userMessages(fromUsername) {
        const msg = {
            fromUsername,
            toUsername: vars.user.username
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(msg)
        }

        const res = await fetch("/api/userMessages", options)
        const data = await res.json()

        if (!data.error) {
            dispatch(setSelectedUser(fromUsername))
            dispatch(setUserMessages(data.data.messages))
        }
    }

    return (
        <div className="container d-flex flex-column gap10">
            <Toolbar/>

            <div className="d-flex gap10">
                <div className="grow1 d-flex flex-column gap10">
                    {
                        vars.uniqueUsers.map((x, i) =>
                            <div key={i}>
                                <Button
                                    className="w100"
                                    variant={x === vars.selectedUser ? "primary" : "outline-secondary"}
                                    onClick={() => userMessages(x)}
                                >
                                    {x}
                                </Button>
                            </div>
                        )
                    }
                </div>
                <div className="grow4">
                    <div className="d-flex flex-column">
                        {
                            vars.userMessages.map((x, i) =>
                                <div key={i}>
                                    <span className={x.fromUsername === vars.user.username ? "receiver" : "sender"}>
                                        <b>{x.fromUsername}</b>:
                                        <span> {x.message}</span>
                                        <small> {new Date(x.time).toLocaleString("pl-PL")}</small>
                                    </span>
                                </div>
                            )
                        }
                    </div>

                    <div className="mt10" style={{float: "right"}}>
                        {vars.selectedUser && <ChatMessage toUsername={vars.selectedUser} userMessages={userMessages}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;