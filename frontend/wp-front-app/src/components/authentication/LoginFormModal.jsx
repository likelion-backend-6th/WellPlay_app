import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useUserActions, getUser, clearUser } from "../../hooks/user.actions";

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const userActions = useUserActions();
  const user = getUser();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLogout = () => {
    setShowModal(false);
    userActions.logout();
    window.location.reload();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const loginForm = event.currentTarget;
    if (loginForm.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    const data = {
      email: form.email,
      password: form.password,
    };
    userActions.login(data)
      .then(() => {
        // 로그인 성공 시 모달을 닫습니다.
        setShowModal(false);
      })
      .catch((err) => {
        if (err.message) {
          setError(err.request.response);
        }
      });
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 상태를 확인하여 버튼 텍스트를 설정합니다.
    if (user) {
      // 사용자가 로그인한 경우
      setShowModal(false); // 모달 닫기
    }
  }, [user]);

  return (
    <>
      {user ? ( // 사용자가 로그인한 경우
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        // 사용자가 로그인하지 않은 경우
        <Button variant="primary" onClick={handleShowModal}>
          Login
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="login-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                type="email"
                placeholder="Enter email"
              />
              <Form.Control.Feedback type="invalid">
                This field is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={form.password}
                minLength="8"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                type="password"
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-content text-danger">
              {error && <p>{error}</p>}
            </div>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginFormModal;