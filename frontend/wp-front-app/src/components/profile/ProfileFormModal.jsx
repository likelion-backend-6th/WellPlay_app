import React, {useEffect, useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useUserActions} from "../../hooks/user.actions";
import {updateProfile} from "../../helpers/ProfileService";

function ProfileFormModal({showModal, closeModal, profileData, onSave}) {
    const [editedProfile, setEditedProfile] = useState({
        nickname: profileData.nickname,
        image: null,
    });
    const {getProfile} = useUserActions();
    const [profile, setProfile] = useState({});
    useEffect(() => {
        // 프로필 정보를 가져오기
        getProfile()
            .then((response) => {
                setProfile(response.data);
                setEditedProfile(response.data)
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });
    }, []);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedProfile({
            ...editedProfile,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setEditedProfile({
            ...editedProfile,
            image: imageFile,
        });
    };

    const handleSave = async () => {
        try {
            // 수정된 프로필 정보와 이미지 파일을 서버에 업데이트
            await updateProfile(editedProfile, editedProfile.image);
            // 수정 후 프로필 정보 다시 불러오기
            onSave();
        } catch (error) {
            console.error('프로필 정보를 업데이트하는 중 오류 발생:', error);
        } finally {
            closeModal();
        }
    };

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>프로필 편집</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="image">
                        <Form.Label>프로필 이미지</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="nickname">
                        <Form.Label>닉네임</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={editedProfile.nickname || ""}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    닫기
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    저장
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProfileFormModal;