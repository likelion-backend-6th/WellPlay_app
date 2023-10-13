import React from "react";
import { Card, Image } from "react-bootstrap";
import { format } from "timeago.js"
import "./Comment.css"

function Comment({ comment }) {
  return (
    <Card className="my-2">
      <Card.Body className="d-flex">
        <Image
          src={comment.profile_image}
          roundedCircle
          alt={comment.user_id}
          width={48}
          height={48}
          className="me-2 border border-dark border-2"
        />
        <div className="comment-content">
          <Card.Title className="comment-username">{comment.user_id}
            <p className="comment-small-text">
              <small>{format(comment.created_at)}</small>
            </p>
          </Card.Title>
          <Card.Text className="comment-text">{comment.content}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Comment;