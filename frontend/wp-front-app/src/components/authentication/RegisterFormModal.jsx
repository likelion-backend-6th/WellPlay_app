import React, {useContext, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useUserActions} from "../../hooks/user.actions";
import {Context} from "../Layout"

function RegisterFormModal(props) {
    const {show, onHide} = props;
    const [validated, setValidated] = useState(false);
    const [form, setForm] = useState({email: "", password: "", nickname: ""});
    const [error, setError] = useState(null);
    const userActions = useUserActions();
    const {setToaster} = useContext(Context)

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
                alert("환영합니다. 인증을 위해 이메일을 확인해주세요.");
                onHide(); // 회원가입 성공 시 모달을 닫습니다.
                window.location.reload();
            })
            .catch((err) => {
                if (err.message) {
                    if (err.response.data.email && err.response.data.email[0].includes("email already exists")) {
                        setToaster({
                            type: "danger",
                            message: "이메일 중복!",
                            show: true,
                            title: "다른 이메일을 사용해주세요",
                        });
                        setForm({...form, email: ""}); // 필드 초기화
                    } else if (err.response.data.user_id && err.response.data.user_id[0].includes("user id already exists")) {
                        setToaster({
                            type: "danger",
                            message: "닉네임 중복!",
                            show: true,
                            title: "다른 닉네임을 사용해주세요",
                        });
                        setForm({...form, nickname: ""}); // 필드 초기화
                    } else if (err.response.data.password && err.response.data.password[0].includes("This password is")) {
                        setToaster({
                            type: "danger",
                            message: "비밀번호가 적절하지 않습니다. 비밀번호는 8자 이상, 알파벳이나 특수문자를 포함해주세요!",
                            show: true,
                            title: "다른 비밀번호를 사용해주세요",
                        });
                        setForm({...form, nickname: ""}); // 필드 초기화
                    } else {
                        setError(err.request.response);
                        setForm({...form, email: "", nickname: "", password: ""}); // 필드 초기화
                    }
                }
            });
    };

    return (
        <Modal show={show} onHide={onHide} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    <img src={`/media/nav/logo.png`} style={{width: '75px', height: '75px'}}/>
                    회원가입
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={`/media/site/dog-bg.png`} style={{width: '50px', height: '50px', marginRight: '10px'}}/>
                    <p className="text-login" style={{display: 'inline-block', marginTop: '14px'}}>당신의 하이라이트를 공유하세요!</p>
                </div>
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
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            required
                            type="email"
                            placeholder="로그인 및 인증에 사용됩니다"
                        />
                        <Form.Control.Feedback type="invalid">
                            올바른 이메일 형식이 필요해요!
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            value={form.nickname}
                            onChange={(e) => setForm({...form, nickname: e.target.value})}
                            required
                            type="text"
                            placeholder="사용자의 아이디입니다."
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control
                            value={form.password}
                            minLength="4"
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            required
                            type="password"
                            placeholder="8자 이상, 숫자로만 이루어지지 않게 정해주세요."
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        회원가입
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default RegisterFormModal;