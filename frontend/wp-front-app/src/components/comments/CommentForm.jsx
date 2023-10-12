// CommentForm.jsx
import React, { useState } from "react";
import axiosService from "../../helpers/axios";

function CommentForm({ feedId, onCommentPosted }) {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const commentData = { content, feed: feedId };

    axiosService
      .post(`/feed/${feedId}/comments/`, commentData)
      .then(() => {
        onCommentPosted(); // 부모 컴포넌트에 새 댓글 게시를 알리기 위한 콜백 함수 호출
        setContent(""); // 댓글 입력을 지우기
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="WOW Well Play!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">댓글 작성</button>
    </form>
  );
}

export default CommentForm;