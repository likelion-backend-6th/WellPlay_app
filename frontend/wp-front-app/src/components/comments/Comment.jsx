import React from "react";
import { Card, Image } from "react-bootstrap";

function Comment({ comment }) {
  return (
    <Card className="my-2">
      <Card.Body className="d-flex">
        <Image
          src={comment.profile_image}
          roundedCircle
          alt={comment.user_id}
          width={40}
          height={40}
          className="me-2 border border-dark border-2"
        />
        <div className="comment-content">
          <Card.Title className="comment-username">{comment.user_id}</Card.Title>
          <Card.Text className="comment-text">{comment.content}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Comment;