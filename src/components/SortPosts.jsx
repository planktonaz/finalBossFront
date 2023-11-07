import React, {useState} from 'react';
import {Button} from "react-bootstrap";

const SortPosts = ({posts, setPosts, sortMethods}) => {
    const [sortCol, setSortCol] = useState('')
    const [ascendingFlag, setAscendingFlag] = useState(false)

    function sortPosts(col) {
        setSortCol(col)
        setAscendingFlag(!ascendingFlag)
        let sorted = []

        if (col === "comments") {
            if (!ascendingFlag) {
                sorted = [...posts].sort((a, b) => a.comments.length - b.comments.length)
            } else {
                sorted = [...posts].sort((a, b) => b.comments.length - a.comments.length)
            }
            setPosts(sorted)
        }
        if (col === "likes") {
            if (!ascendingFlag) {
                sorted = [...posts].sort((a, b) => a.likes.length - b.likes.length)
            } else {
                sorted = [...posts].sort((a, b) => b.likes.length - a.likes.length)
            }
            setPosts(sorted)
        }
        if (col === "time") {
            if (!ascendingFlag) {
                sorted = [...posts].sort((a, b) => a.time - b.time)
            } else {
                sorted = [...posts].sort((a, b) => b.time - a.time)
            }
            setPosts(sorted)
        }
    }

    return (
        <div className="d-flex j-center a-center gap20 p10 bg-light border">
            Sort by:
            <Button variant={sortCol === "comments" ? "primary" : "outline-secondary"} size="sm"
                    onClick={() => sortPosts("comments")}>
                {sortCol === "comments" && ascendingFlag && "Comments amount 🔼"}
                {sortCol === "comments" && !ascendingFlag && "Comments amount 🔽"}
                {sortCol !== "comments" && "Comments amount"}
            </Button>
            <Button variant={sortCol === "likes" ? "primary" : "outline-secondary"} size="sm"
                    onClick={() => sortPosts("likes")}>
                {sortCol === "likes" && ascendingFlag && "Likes amount 🔼"}
                {sortCol === "likes" && !ascendingFlag && "Likes amount 🔽"}
                {sortCol !== "likes" && "Likes amount"}
            </Button>
            <Button variant={sortCol === "time" ? "primary" : "outline-secondary"} size="sm"
                    onClick={() => sortPosts("time")}>
                {sortCol === "time" && ascendingFlag && "Time created 🔼"}
                {sortCol === "time" && !ascendingFlag && "Time created 🔽"}
                {sortCol !== "time" && "Time created"}
            </Button>
        </div>
    );
};

export default SortPosts;