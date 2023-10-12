import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import CommentForm from "./CommentForm";   

function CommentList({ feedId, onCommentPosted }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // 주어진 feedId에 대한 댓글을 가져오는 API 요청
    axiosService
      .get(`/feed/${feedId}/comments/`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [feedId]);

  return (
    <div>
      <h3>댓글</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - {comment.author}
          </li>
        ))}
      </ul>
      <CommentForm feedId={feedId} onCommentPosted={onCommentPosted} />
    </div>
  );
}

export default CommentList;