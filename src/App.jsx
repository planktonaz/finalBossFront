import './App.css'
import {useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Routes, Route, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import {setUser} from "./features/vars";
import RegPage from "./pages/RegPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import PostsPage from "./pages/PostsPage";
import UsersPage from "./pages/UsersPage";
import LogoutPage from "./pages/LogoutPage";

function App() {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const toPage = useNavigate()

    useEffect(() => {
        const autologin = localStorage.getItem("autologin")

        if (autologin === "true") {
            const options = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: localStorage.getItem("token")
                }
            }

            fetch("/api/autologin", options)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) {
                        setError("")
                        dispatch(setUser(data.data))
                        toPage("/profile")
                    } else {
                        setError(data.message)
                    }
                })
        }
    }, [])

    return (
        <div>
            <div className="d-flex j-center">
                <h4 className="text-danger">{error}</h4>
            </div>

            <Routes>
                <Route path="/" element={<RegPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/messages" element={<MessagesPage/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/logout" element={<LogoutPage/>}/>
            </Routes>

        </div>
    )
}

export default App;
