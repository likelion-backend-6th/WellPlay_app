import React, {useEffect, useState} from "react"
import {Card, DropdownButton, Image, Modal, Dropdown, Button, Form} from "react-bootstrap"
import {format} from "timeago.js"
import {CommentOutlined, LikeFilled, LikeOutlined, ShareAltOutlined} from "@ant-design/icons"
import axiosService from "../../helpers/axios"
import {Link} from "react-router-dom"
import {getUser, useUserActions} from "../../hooks/user.actions"
import CommentModal from "../comments/CommentModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import "../default.css"

function Feed(props) {
    const {feed, refresh, isSingleFeed, handleLikeClickinModal} = props
    const user = getUser();
    const {getUserProfile} = useUserActions();
    const [profile, setProfile] = useState({});
    const userid = feed.user_id
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateFeed, setShowUpdateFeed] = useState(false);
    const [form, setForm] = useState({body: feed.content})
    const data = new FormData();
    let nowUrl = window.location.href;
    let isLikedUser = false
    if (user) {
        isLikedUser = feed.liked_user.includes(user.user_id)
    }


    data.append('content', form.body);
    const [showCommentModal, setShowCommentModal] = useState(false);


    const fetchProfile = (userid) => {
        getUserProfile(userid)
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });
    };
    useEffect(() => {
        fetchProfile(userid);
    }, [userid]);

    const handleLikeClick = (action, data) => {
        axiosService
            .post(`/feed/${feed.id}/${action}/`, data)
            .then(() => {
                refresh();
            })
            .catch((err) => console.error(err))
    }
    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleEditClick = () => {
        setShowUpdateFeed(true);
    };

    const confirmUpdateFeed = () => {
        axiosService
            .put(`/feed/${feed.id}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(() => {
                refresh()
            })

        setShowUpdateFeed(false);
    };

    const confirmDelete = () => {
        axiosService
            .delete(`/feed/${feed.id}/`)
            .then(() => {
                refresh()
            })
            .catch((err) => console.error(err))
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };
    const cancelUpdate = () => {
        setShowUpdateFeed(false);
    };

    const handleCopyClipBoard = (text) => {
        try {
            // navigator.clipboard.writeText(text);
            const $textarea = document.createElement('textarea');
            document.body.appendChild($textarea);
            $textarea.value = text;
            $textarea.select();
            document.execCommand("copy")
            document.body.removeChild($textarea);
            alert("클립보드에 링크가 복사되었습니다.");
        } catch (err) {
        }
    };


    return (
        <>
            <Card className="custom-card rounded-5 mt-4 mb-2">
                <Card.Body>
                    <Card.Title className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-row">
                            <Link to={`/profile/${feed.user_id}/`}>
                                <Image
                                    src={feed.profile_image}
                                    roundedCircle
                                    width={48}
                                    height={48}
                                    className="me-2 border border-dark
                          border-2"
                                />
                            </Link>
                            <div className="d-flex flex-column justify-content-start align-self-center mt-2">
                                <p className="fs-6 m-0">{profile.nickname}</p>
                                <p className="fs-6 fw-lighter">
                                    <small>{format(feed.created_at)}</small>
                                </p>
                            </div>
                        </div>
                        {user && user.user_id === feed.user_id && (
                            <>
                                <DropdownButton
                                    title={<FontAwesomeIcon icon={faEllipsisV}/>}
                                    id="menu-dropdown"
                                    show={showMenu}
                                    onClick={handleMenuClick}
                                >
                                    <Dropdown.Item onClick={handleDeleteClick}>삭제</Dropdown.Item>
                                    <Dropdown.Item onClick={handleEditClick}>수정</Dropdown.Item>
                                </DropdownButton>
                                <Modal show={showDeleteModal} onHide={cancelDelete} className="custom-modal">
                                    <Modal.Header closeButton>
                                        <Modal.Title>삭제 확인</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>'{feed.content}' 글을 삭제하시겠습니까?</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={cancelDelete}>
                                            취소
                                        </Button>
                                        <Button variant="primary" onClick={confirmDelete}>
                                            확인
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={showUpdateFeed} onHide={cancelUpdate} className="custom-modal">
                                    <Modal.Header closeButton>
                                        <Modal.Title>글 수정</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body><Form onSubmit={confirmUpdateFeed}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Content</Form.Label>
                                            <Form.Control
                                                name="body"
                                                value={form.body}
                                                onChange={(e) => setForm({...form, body: e.target.value})}
                                                as="textarea"
                                                rows={3}
                                            />
                                        </Form.Group>
                                    </Form></Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={cancelUpdate}>
                                            취소
                                        </Button>
                                        <Button variant="primary" onClick={confirmUpdateFeed}>
                                            확인
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}
                    </Card.Title>
                    <Card.Text>
                        <span>
                        <span dangerouslySetInnerHTML={{ __html: feed.content.replace(/\n/g, '<br>') }} />
                        </span>
                        <br/><br/>
                        {feed.image_url && (
                            <Image
                                src={feed.image_url}
                                style={{maxWidth: "100%", height: "400px", width: "auto"}}
                                className="me-2 mb-3 border border-dark border-2"
                            />
                        )}
                        {feed.video_url && (
                            <video
                                src={feed.video_url}
                                style={{maxWidth: "100%", height: "100%", width: "auto"}}
                                controls={true}
                                className="border border-dark border-2"
                                loop={false}
                                muted={false}
                            />
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="custom-card rounded-4 d-flex flex-row justify-content-between mb-4">
                <div className="d-flex flex-row w-100 justify-content-center mt-2">
                    <LikeOutlined
                        style={{
                            width: "24px",
                            height: "24px",
                            padding: "2px",
                            fontSize: "20px",
                            color: user && isLikedUser ? "#0D6EFD" : "#C4C4C4",
                            cursor: !user ? "not-allowed" : "pointer",
                        }}
                        onClick={() => {
                            if (!user) {
                                window.location.reload();
                                alert("로그인이 필요합니다");
                            } else {
                                {
                                    isSingleFeed ? (
                                        handleLikeClickinModal("like", {"user": user.id, "feed": feed.id})
                                    ) : (
                                        handleLikeClick("like", {"user": user.id, "feed": feed.id})
                                    )
                                }
                            }
                        }}
                    />
                    <p className="ms-1 me-2">
                        <small>{feed.like}</small>
                    </p>
                </div>
                {!isSingleFeed && (
                    <div className="d-flex flex-row w-100 justify-content-center mt-2">
                        <CommentOutlined
                            style={{
                                width: "24px",
                                height: "24px",
                                padding: "2px",
                                fontSize: "20px",
                                color: "#C4C4C4",
                                cursor: !user ? "not-allowed" : "pointer",
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                if (!user) {
                                    window.location.reload();
                                    alert("로그인이 필요합니다");
                                } else {
                                    setShowCommentModal(true);
                                }
                            }}
                        />
                        <p className="ms-1 me-2">
                            <small>{feed.comment}</small>
                        </p>
                    </div>
                )}
                <div className="d-flex flex-row w-100 justify-content-center mt-2">
                    <ShareAltOutlined
                        style={{
                            width: "24px",
                            height: "24px",
                            padding: "2px",
                            fontSize: "20px",
                            color: "#C4C4C4",
                        }}
                        onClick={() => {
                            handleCopyClipBoard(nowUrl)
                        }}
                    />
                    <p className="ms-1 me-2">
                        <small></small>
                    </p>
                </div>
            </Card>
            <CommentModal
                feedId={feed.id}
                show={showCommentModal}
                size="lg"
                handleClose={() => setShowCommentModal(false)}
                props={props}
                referesh={refresh}
            />
        </>
    )
}

export default Feed