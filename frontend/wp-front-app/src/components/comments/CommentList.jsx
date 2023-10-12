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
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content} - {comment.author}
          </li>
        ))}
      </ul>
      {/* CommentForm에서 날아온 콜백함수를 보고 handleCommentPosted 실행  */}
      <CommentForm feedId={feedId} onCommentPosted={handleCommentPosted} /> 
    </div>
  );
}

export default CommentList;