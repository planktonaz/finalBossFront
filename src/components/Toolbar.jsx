import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHref, useNavigate, useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {setUser} from "../features/vars";

const Toolbar = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()
    const toPage = useNavigate()
    const params = useParams()
    const href = useHref()

    function logout() {
        localStorage.setItem("autologin", "");
        localStorage.setItem("token", "");
        dispatch(setUser({}))
        toPage("/logout")
    }

    return (
        <div className="d-flex a-center gap10 p-2 border">
            {vars.user.username && <b>{vars.user.username.toUpperCase()}</b>}
            {
                !vars.user.id &&
                <Link to="/">
                    <Button type="button" variant={href === "/" ? "primary" : "secondary"}>
                        Register
                    </Button>
                </Link>
            }
            {
                !vars.user.id &&
                <Link to="/login">
                    <Button type="button" variant={href === "/login" ? "primary" : "secondary"}>
                        Login
                    </Button>
                </Link>
            }
            {
                vars.user.id &&
                <Link to="/profile">
                    <Button type="button" variant={href === "/profile" ? "primary" : "secondary"}>
                        Profile
                    </Button>
                </Link>
            }
            {
                vars.user.id &&
                <Link to="/messages">
                    <Button type="button" variant={href === "/messages" ? "primary" : "secondary"}>
                        Messages
                    </Button>
                </Link>
            }
            {
                vars.user.id &&
                <Link to="/posts">
                    <Button type="button" variant={href === "/posts" ? "primary" : "secondary"}>
                        Posts
                    </Button>
                </Link>
            }
            {
                vars.user.id &&
                <Link to="/users">
                    <Button type="button" variant={href === "/users" ? "primary" : "secondary"}>
                        Users
                    </Button>
                </Link>
            }
            {
                vars.user.id &&
                <Link to="/logout">
                    <Button type="button" variant={href === "/logout" ? "primary" : "secondary"} onClick={logout}>
                        Logout
                    </Button>
                </Link>
            }
        </div>
    );
};

export default Toolbar;