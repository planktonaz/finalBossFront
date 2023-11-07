import React, {useRef, useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {addUserMessage} from "../features/vars";

const SendMessage = ({toUsername}) => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [showSendMsgModal, setShowSendMsgModal] = useState(false);
    const [error, setError] = useState("")
    const textRef = useRef()

    function sendMsgModal(username) {
        setShowSendMsgModal(true);
    }

    function closeModal() {
        setShowSendMsgModal(false);
    }

    async function sendMessage() {
        const msg = {
            fromUsername: vars.user.username,
            toUsername: toUsername,
            message: textRef.current.value
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(msg)
        }

        const res = await fetch("/api/sendMessage", options)
        const data = await res.json()

        if (!data.error) {
            setError("")
            closeModal();
        } else {
            setError(data.message)
        }
    }

    return (
        <div>
            <Button variant="outline-secondary" size="sm" onClick={() => sendMsgModal(toUsername)}>
                Write message
            </Button>

            <Modal
                show={showSendMsgModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Send a message to <b>{toUsername.toUpperCase()}</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="modalEl">
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

export default SendMessage;