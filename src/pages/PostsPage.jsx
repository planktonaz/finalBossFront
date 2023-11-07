import React, {useEffect, useRef, useState} from 'react';
import Toolbar from "../components/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "react-bootstrap";
import {addPost, setPostComments, setPosts} from "../features/vars";
import SendMessage from "../components/SendMessage";
import PostComments from "../components/PostComments";
import SortPosts from "../components/SortPosts";

const PostsPage = () => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const [showPostModal, setShowPostModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const [post, setPost] = useState({username: ""})
    const [xLikes, setXLikes] = useState(0)
    const [error, setError] = useState("")
    const titleRef = useRef()
    const imageRef = useRef()

    const [posts, setPosts] = useState([])
    const [sortState, setSortState] = useState("none");
    const sortMethods = {
        none: {method: (a, b) => null},
        ascending: {method: undefined},
        descending: {method: (a, b) => (a > b ? -1 : 1)},
    };

    function postModal(xPostObj) {
        setPost(xPostObj)
        setXLikes(xPostObj.likes.length)
        dispatch(setPostComments(xPostObj.comments))
        setShowPostModal(true);
    }

    function createPostModal(username) {
        setShowCreatePostModal(true);
    }

    function closeModal() {
        setShowPostModal(false);
        setShowCreatePostModal(false);
        setRefreshPosts(refreshPosts + 1)
    }

    async function createPost() {
        const post = {
            id: vars.user.id,
            title: titleRef.current.value,
            image: imageRef.current.value,
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(post)
        }

        const res = await fetch("/api/createPost", options)
        const data = await res.json()

        if (!data.error) {
            setError("")
            dispatch(addPost(data.data.post))
            closeModal();
        } else {
            setError(data.message)
        }
    }

    async function updateLikes(xPostId) {
        const post = {
            postId: xPostId,
            username: vars.user.username
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(post)
        }

        const res = await fetch("/api/updatePostLikes", options)
        const data = await res.json()

        if (!data.error) {
            setXLikes(data.data.post.likes.length)
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

        fetch("/api/getPosts", options)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setError("")
                    setPosts(data.data.posts)
                } else {
                    setError(data.message)
                }
            })
    }, [refreshPosts]);

    return (
        <div className="container d-flex flex-column gap10">
            <Toolbar/>

            <div className="d-flex gap20">
                <SortPosts posts={posts} setPosts={setPosts} sortMethods={sortMethods}/>
                <Button variant="outline-primary" size="sm" onClick={createPostModal}>Create post</Button>
            </div>
            <div className="d-flex wrap gap10">
                {
                    //vars.posts
                    posts
                        .sort(sortMethods[sortState].method)
                        .map((x, i) =>
                            <div className="post d-flex flex-column p5 border"
                                 key={i}
                                 onClick={() => postModal(x, x._id, x.username, x.title, x.image, x.likes.length)}
                            >
                                <div>
                                    {
                                        x.image && <img src={x.image} alt=""/>
                                    }
                                    <div>
                                        {x.title}
                                    </div>
                                    <div>
                                        Likes: <b>{x.likes.length}</b>
                                    </div>
                                    <div>
                                        Comments: <b>{x.comments.length}</b>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>

            <Modal
                show={showPostModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{post.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="d-flex gap10">
                        <div className="modalImgBig grow2">
                            <img src={post.image} alt=""/>
                        </div>
                        <div className="grow1 d-flex flex-column gap20">
                            <div className="p5 border rounded bgFirst">
                                Post owner is: <b>{post.username.toUpperCase()}</b>
                                {vars.user.username !== post.username && <SendMessage toUsername={post.username}/>}
                            </div>

                            <h4>{post.title}</h4>
                            <div className="d-flex gap10">
                                {
                                    post.username !== vars.user.username &&
                                    <Button
                                        className="mr10"
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => updateLikes(post._id)}
                                    >
                                        Like
                                    </Button>
                                }
                                <span>
                                    Likes: <b>{xLikes}</b>
                                </span>
                            </div>

                        </div>
                    </div>
                    <PostComments post={post}/>
                </Modal.Body>

            </Modal>

            <Modal
                show={showCreatePostModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">{error}</h4>
                    <div className="modalEl">
                        <input type="text" ref={titleRef} placeholder="Title"/>
                        <input type="text" ref={imageRef} placeholder="Image URL"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createPost}>
                        Create post
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default PostsPage;