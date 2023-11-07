import React, {useRef} from 'react';
import {setPostComments, setPosts} from "../features/vars";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "react-bootstrap";

const PostComments = ({post}) => {
    const vars = useSelector(state => state.vars)
    const dispatch = useDispatch()

    const commentRef = useRef()

    async function sendComment() {
        const comment = {
            postId: post._id,
            username: vars.user.username,
            comment: commentRef.current.value
        }

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(comment)
        }

        const res = await fetch("/api/updatePostComments", options)
        const data = await res.json()

        if (!data.error) {
            dispatch(setPostComments(data.data.post.comments))
            commentRef.current.value = ""
        }
    }

    return (
        <div className="postComments d-flex flex-column gap10 border">
            {
                vars.postComments.map((x, i) =>
                    <div className="comment border" key={i}>
                        <span>{x.username}</span>:
                        <h4> {x.comment}</h4>
                        <small> {new Date(x.time).toLocaleString("pl-PL")}</small>
                    </div>
                )
            }
            <div className="d-flex gap10">
                <input className="w-100" type="text" ref={commentRef} placeholder="Comment"/>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={sendComment}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default PostComments;