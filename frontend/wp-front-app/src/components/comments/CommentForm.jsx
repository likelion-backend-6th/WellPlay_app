// 덧글 작성하는 컴포넌트
import React, { useState } from "react";
import axiosService from "../../helpers/axios";

function CommentForm({ feedId, onCommentPosted }) { // 여기에도 콜백 함수 적어주고
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const commentData = { content, feed: feedId };

    axiosService
      .post(`/feed/${feedId}/comments/`, commentData)
      .then(() => {
        onCommentPosted(); // 부모 컴포넌트에 새 댓글 게시를 알리기 위한 콜백 함수 호출
        setContent("");
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