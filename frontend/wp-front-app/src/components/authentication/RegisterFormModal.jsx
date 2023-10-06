import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useUserActions } from "../../hooks/user.actions";
import { Context } from "../Layout"

function RegisterFormModal(props) {
  const { show, onHide } = props;
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  const userActions = useUserActions();
  const { setToaster } = useContext(Context)

  const handleSubmit = (event) => {
    event.preventDefault();
    const registerForm = event.currentTarget;
    if (registerForm.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const data = {
      user_id: form.nickname,
      email: form.email,
      password: form.password,
    };

    userActions
      .register(data)
      .then(() => {
			setForm({ ...form, body: "" })
			setToaster({
				type: "success",
				message: "당신의 모든 하이라이트를 함께하세요🚀",
				show: true,
				title: "환영합니다!",
			})
            onHide(); // 회원가입 성공 시 모달을 닫습니다.
      })
      .catch((err) => {
        if (err.message) {
            if (err.message) {
                // 이미 존재하는 이메일에 대한 에러 처리
                setToaster({
                  type: "danger",
                  message: "이메일 또는 닉네임 중복!",
                  show: true,
                  title: "다시 시도해주세요",
                });
              } else {
                setError(err.request.response);
              }
        }
      });

  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">Well Play, 당신의 하이라이트를 공유하세요</p>
        <Form
          id="register-form"
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
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              required
              type="text"
              placeholder="Enter nickname"
            />
            <Form.Control.Feedback type="invalid">
                올바른 이메일 형식이 필요해요!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={form.password}
              minLength="4"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              type="password"
              placeholder="Password"
            />
          </Form.Group>
            {/*<div className="text-content text-danger">
              {error && <p>{error}</p>}
              </div>*/}
          <Button variant="primary" type="submit">
            회원가입
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterFormModal;