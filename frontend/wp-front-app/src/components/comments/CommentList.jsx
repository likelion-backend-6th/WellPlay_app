import React, { useState, useEffect } from "react";
import axiosService from "../../helpers/axios";
import CommentForm from "./CommentForm";
import Comment from "./Comment"; // 새로 추가한 부분

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

  const handleCommentPosted = () => {
    // 새 댓글이 게시되면 댓글 목록을 새로 고칩니다.
    axiosService
      .get(`/feed/${feedId}/comments/`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} /> // Comment 컴포넌트로 변경
      ))}
      <CommentForm feedId={feedId} onCommentPosted={handleCommentPosted} /> 
    </div>
  );
}

export default CommentList;