import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useUserActions, getUser } from "../../hooks/user.actions";
import RegisterFormModal from "./RegisterFormModal"; // RegisterFormModal 컴포넌트를 import
import { Context } from "../Layout"

function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // 가입하기 버튼을 누를 때 사용할 상태 추가
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({email: "", password: ""});
  const [error, setError] = useState(null);
  const userActions = useUserActions();
  const user = getUser();
  const { setToaster } = useContext(Context)

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
    const data = {  // 실제로 데이터 보내지는 부분
      email: form.email,
      password: form.password,
    };
    userActions
      .login(data)
      .then(() => {
        setForm({ ...form, body: "" })
			  setToaster({
          type: "success",
          message: "당신의 모든 하이라이트를 함께하세요🚀",
          show: true,
          title: "환영합니다!",
			  })
        setShowModal(false); // 로그인 성공 시 모달을 닫습니다.
      })
      .catch((err) => {
        console.log(err.response.data.message)
        if (err.message) {
          if (err.response.data.message && err.response.data.message.includes("email not exists")) {
            setError("이메일이 존재하지 않습니다.");
          }else{
            setError("비밀번호가 잘못되었습니다.");
          }
        }
      });
  };

  const handleShowRegisterModal = () => {
    setShowModal(false); // 현재 모달을 닫음
    setShowRegisterModal(true); // 가입하기 모달을 열음
  };

  useEffect(() => {  // 컴포넌트가 마운트될 때 로그인 상태를 확인하여 버튼 텍스트를 설정합니다
    if (user) { // 사용자가 로그인한 경우
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
          <Modal.Title>로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">Well Play, 당신의 하이라이트를 공유하세요</p>
          <Form
            id="login-form"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              {/*로그인 폼의 HTML 요소들은 다음과 같이 사용자가 입력한 값과 관련된 state인 form 객체에 업데이트됩니다.
              사용자가 이메일 필드에 값을 입력하면 onChange 이벤트 핸들러가 호출되고, 그 결과로 form.email이 업데이트됩니다.*/}
              <Form.Control
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                type="email"
                placeholder="Enter email"
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
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <div className="text-content text-danger">
              {error && <p className="text-danger">{error}</p>} {/* 에러 메시지를 화면에 표시 */}
            </div>
            <Button variant="primary" type="submit">
              로그인
            </Button>
            <p className="text-muted">
              아직 회원이 아니신가요?
              <Button variant="link" onClick={handleShowRegisterModal}>
                가입하기
              </Button>
            </p>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 가입하기 모달 */}
      <RegisterFormModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} />
    </>
  );
}

export default LoginFormModal;