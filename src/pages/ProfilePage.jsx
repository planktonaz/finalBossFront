import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Toolbar from "../components/Toolbar";
import {Button,Modal} from "react-bootstrap";

import {setUser} from "../features/vars";

const ProfilePage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [showImageModal, setShowImageModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [error,setError] = useState("")
    const pass1Ref = useRef()
    const pass2Ref = useRef()
    const imageRef = useRef()

    const imageModal = () => setShowImageModal(true);
    const passwordModal = () => setShowPasswordModal(true);

    function closeModal(){
        setShowImageModal(false);
        setShowPasswordModal(false);
    }

    async function updateImage(){
        const user = {
            id: vars.user.id,
            image: imageRef.current.value,
        }

        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(user)
        }

        const res = await fetch("/api/updateUserImage", options)
        const data = await res.json()

        if(!data.error) {
            setError("")
            dispatch(setUser(data.data))
            closeModal();
        } else {
            setError(data.message)
        }
    }

    async function updatePassword(){
        const user = {
            username: vars.user.username,
            pass1: pass1Ref.current.value,
            pass2: pass2Ref.current.value,
        }

        const options = {
            method: "POST",
            headers: {
                "content-type":"application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(user)
        }

        const res = await fetch("/api/updateUserPassword", options)
        const data = await res.json()

        if(!data.error) {
            setError("")
            closeModal();
        } else {
            setError(data.message)
        }
    }

    return (
        <div className="container d-flex flex-column gap10">
            <Toolbar/>

            <div className="d-flex gap20">
                <div className="d-flex flex-column gap20">
                    <div className="profileImg border">
                        <img src={vars.user.image ? vars.user.image : "/api/images/profile4.jpg"} alt=""/>
                    </div>
                    <Button onClick={imageModal}>Change picture</Button>
                </div>
                <div>
                    <Button onClick={passwordModal}>Change password</Button>
                </div>
            </div>

            <Modal
                show={showImageModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="profile">
                        <input type="text" ref={imageRef} placeholder="User photo URL"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateImage}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showPasswordModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change user password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="profile">
                        <input type="text" ref={pass1Ref} placeholder="Password 1"/>
                        <input type="text" ref={pass2Ref} placeholder="Password 2"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updatePassword}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ProfilePage;