import React, {useEffect, useState,useRef} from 'react';
import Toolbar from "../components/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {setUser, setUsers} from "../features/vars";
import {useNavigate} from "react-router-dom";
import {Button, Modal} from "react-bootstrap";

const UsersPage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [showUserModal, setShowUserModal] = useState(false);
    const [error, setError] = useState("")
    const [toUsername, setToUsername] = useState("")
    const textRef = useRef()
    const toPage = useNavigate()

    function userModal(username){
        setToUsername(username)
        setShowUserModal(true);
    }

    function closeModal(){
        setShowUserModal(false);
    }

    async function sendMessage(){
        const msg = {
            fromUsername: vars.user.username,
            toUsername: toUsername,
            message: textRef.current.value
        }

        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(msg)
        }

        const res = await fetch("/api/sendMessage", options)
        const data = await res.json()

        if(!data.error) {
            setError("")
            closeModal();
        } else {
            setError(data.message)
        }
    }

    useEffect(() => {
        const options = {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                authorization: localStorage.getItem("token")
            }
        }

        fetch("/api/users", options)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setError("")
                    dispatch(setUsers(data.data.users))
                } else {
                    setError(data.message)
                }
            })
    }, []);

    return (
        <div className="container d-flex flex-column gap10">
            <Toolbar/>

            <h4 className="text-danger">{error}</h4>
            <div className="d-flex gap10 wrap">
                {
                    vars.users.map((x, i) =>
                        <div className="d-flex p5 border" key={i}>
                            {
                                <div className="userImg">
                                    <img src={x.image ? x.image : "/api/images/profile4.jpg"} alt=""/>
                                </div>
                            }
                            <div>
                                <div>
                                    <b>{x.username}</b>
                                </div>
                                <div>
                                    {x.username !== vars.user.username &&
                                        <Button variant="outline-secondary" size="sm" onClick={()=>userModal(x.username)}>
                                            Write message
                                        </Button>}
                                </div>
                            </div>
                        </div>)
                }
            </div>

            <Modal
                show={showUserModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Send a message to <b>{toUsername.toUpperCase()}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="profile">
                        <textarea ref={textRef} rows="4" cols="50"></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={sendMessage}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default UsersPage;