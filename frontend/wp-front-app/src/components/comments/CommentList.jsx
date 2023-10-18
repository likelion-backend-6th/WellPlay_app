import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import CommentForm from "./CommentForm";
import Comment from "./Comment"; // 새로 추가한 부분
import { Card } from "react-bootstrap";
import "../default.css";

function CommentList({ feedId, onCommentPosted, props, }) {
  const [comments, setComments] = useState([]);
  const {refresh} = props

  useEffect(() => {
    axiosService
      .get(`/feed/${feedId}/comments/`)
      .then((response) => {
        const sortedComments = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 최신 댓글 순으로 정렬
        setComments(sortedComments);
        refresh();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [feedId]);

  const fetchComments = () => {
    axiosService
      .get(`/feed/${feedId}/comments/`)
      .then((response) => {
        const sortedComments = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setComments(sortedComments);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [feedId]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  return (
    <Card className="custom-card rounded-3 my-4" style={{ maxHeight: "63vh", overflowY: "auto" }}>
      <Card.Body>
        <CommentForm feedId={feedId} onCommentPosted={handleCommentPosted} />
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            feedId={feedId}
            comment={comment}
            refresh={fetchComments} // fetchComments를 refresh 함수로 전달
          />
        ))}
      </Card.Body>
    </Card>
  );
}

export default CommentList;