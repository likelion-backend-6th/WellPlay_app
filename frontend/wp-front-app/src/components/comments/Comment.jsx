import React from "react";

function Comment({ comment }) {
  return (
    <div className="comment">
      <img src={comment.author.profile_image} alt={comment.author.username} className="profile-image" />
      <div className="comment-content">
        <p className="comment-username">{comment.author.username}</p>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
}

export default Comment;