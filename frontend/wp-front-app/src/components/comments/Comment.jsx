import React, { useEffect, useState } from "react";
import { Card, DropdownButton, Image, Modal, Dropdown, Button, Form } from "react-bootstrap";
import { format } from "timeago.js";
import "./Comment.css";
import "../default.css"
import { getUser, useUserActions } from "../../hooks/user.actions";
import axiosService from "../../helpers/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function Comment({ feedId, comment, refresh }) {
  const user = getUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ShowUpdateComment, setShowUpdateComment] = useState(false);
  const [form, setForm] = useState({ body: comment.content });
  const data = new FormData();

  console.log("Comment에서", feedId);
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    setShowUpdateComment(true);
  };

  const confirmUpdateComment = () => {
    data.append("content", form.body);
    axiosService
      .put(`/feed/${feedId}/comments/${comment.id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        refresh();
      })
      .catch((error) => console.error(error));

    setShowUpdateComment(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };
  const cancelUpdate = () => {
    setShowUpdateComment(false);
  };

  const confirmDelete = () => {
    axiosService
      .delete(`/feed/${feedId}/comments/${comment.id}/`)
      .then(() => {
        refresh();
      })
      .catch((err) => console.error(err));
    setShowDeleteModal(false);
  };

  return (
    <Card className="custom-card my-2">
      <Card.Body className="d-flex justify-content-between align-items-start">
        <div className="d-flex align-items-start">
          <Link to={`/profile/${comment.user_id}`}>
            <Image src={comment.profile_image} roundedCircle alt={comment.user_id} width={48} height={48} className="me-2 border border-dark border-2" />
          </Link>
          <div className="comment-content">
            <Card.Title className="comment-username">{comment.user_id}
              <p className="comment-small-text">
                <small>{format(comment.created_at)}</small>
              </p>
            </Card.Title>
            <Card.Text className="comment-text">{comment.content}</Card.Text>
          </div>
        </div>

        {user && user.user_id === comment.user_id && (
          <DropdownButton
            title={<FontAwesomeIcon icon={faEllipsisV} />}
            id="menu-dropdown"
            show={showMenu}
            onClick={handleMenuClick}
            className="p-1"
          >
            <Dropdown.Item onClick={handleDeleteClick}>삭제</Dropdown.Item>
            <Dropdown.Item onClick={handleEditClick}>수정</Dropdown.Item>
          </DropdownButton>
        )}
      </Card.Body>

      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>'{comment.content}' 댓글을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            취소
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={ShowUpdateComment} onHide={cancelUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>댓글 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={confirmUpdateComment}>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                name="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelUpdate}>
            취소
          </Button>
          <Button variant="primary" onClick={confirmUpdateComment}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default Comment;