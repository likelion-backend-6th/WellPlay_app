import React, {useEffect, useState} from 'react';
import {Button, Image, Form, Spinner, Card, Modal} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser, useUserActions} from '../../hooks/user.actions';
import {serverUrl} from '../../config'
import axios from 'axios';
import ProfileFormModal from "./ProfileFormModal";
import {useNavigate, useParams} from "react-router-dom";
import FollowerList from "../follow/Follower"
import FollowingList from "../follow/Following"
import '../../App.css'


function UserProfile(props) {
    const {getProfile, getFollowing, getFollower,
        updateUsernameLol, apiPostLol, apiGetLol } = useUserActions();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLOLModal, setShowLOLModal] = useState(false);
    
    const [showFollowerList, setShowFollowerList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [showGameinfoList, setShowGameinfoList] = useState(false)
    const [showUserStoryList, setShowUserStoryList] = useState(false)

    const navigate = useNavigate();
    const {profileId} = useParams();
    const [previousRequestTime, setPreviousRequestTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0); // 남은 시간 상태 추가
    const [timerId, setTimerId] = useState(null); // 타이머 ID 상태 추가
    const [userInfo, setUserInfo] = useState(null);

    const [modalInputValue, setModalInputValue] = useState("");
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [modalRemainingTime, setModalRemainingTime] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const user = getUser();

    const fetchProfile = () => {
        getProfile()
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });
    };

    // 모달 열기 함수
    const openModal = () => {
        setShowModal(true);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        setShowModal(false);
    };

    const openLOLModal = () => {
        setShowLOLModal(true);
    };
    
    const closeLOLModal = () => {
        setShowLOLModal(false);
    };

    const handleSaveModal = () => {
        closeModal();
        fetchProfile();
    }

    const handleConnectClick = () => {
        if (remainingTime > 0) {
            return;
        }
        const now = Date.now();
        setPreviousRequestTime(now);
        setIsLoading(true);

        const newLolName = modalInputValue;
        const requestData = { summoner_name: newLolName };
        console.log("연동하기 버튼을 클릭하였습니다. 닉네임: ", newLolName);

        // 롤 api연동 백그라운드 작업
        apiPostLol(requestData)
        .then((response) => {
            if (response.data) {
                setSuccessMessage(response.data.message);
                alert('연동이 성공적으로 완료되었습니다.');
                window.location.reload();
            } else {
                if (response.data.message) {
                    setError(response.data.message);
                    alert('연동이 실패하였습니다: ' + response.data.message);
                } else {
                    alert('연동이 실패하였습니다.');
                }
                window.location.reload(); 
            }
        })
        .catch((error) => {
            setError(error.response ? error.response.data.message : '서버 오류'); // 요청 자체가 실패한 경우
            alert('서버 요청에 실패했습니다.');
            window.location.reload(); 
        });


        // DB에 게임 닉네임 보내기
        updateUsernameLol(requestData)
            .then(response => {
                setSuccessMessage(response.data.message);
            })
            .catch(error => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
                setIsLoading(false);
            });

        console.log("연동이 종료되었습니다.");
        setTimeout(() => {
            fetchProfile(profileId);
        }, 2000);
    };

    useEffect(() => {
        // 프로필 정보를 가져오기
        fetchProfile();

        getFollowing()
            .then((response) => {
                setFollowing(response.data);
            })
            .catch((error) => {
                console.error('팔로워 정보를 가져오는 중 오류 발생:', error);
            })

        getFollower()
            .then((response) => {
                setFollower(response.data);
            })
            .catch((error) => {
                console.error('팔로워 정보를 가져오는 중 오류 발생:', error);
            })

        apiGetLol(profileId) // 유저의 lol 정보를 불러옵니다
            .then((response) => {
                console.log(profile.id)
                setUserInfo(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });
    }, [profileId]);

    const handleModalInputChange = (e) => {
        setModalInputValue(e.target.value);
        setError(null);
    };

    const handleShowFollowerList = () => {
        setShowFollowerList(true);
        setShowFollowingList(false);
    };
    
    const handleShowFollowingList = () => {
        setShowFollowingList(true);
        setShowFollowerList(false);
    };
    
    const handleHideFollowerList = () => {
        setShowFollowerList(false);
    };
    
    const handleHideFollowingList = () => {
        setShowFollowingList(false);
    };

    
    const handleShowGameinfoList = () => {
        setShowGameinfoList(true);
        setShowUserStoryList(false);
    };
    
    const handleHideGameinfoList = () => {
        setShowGameinfoList(false);
    };
    
    const handleShowUserStoryList = () => {
        setShowUserStoryList(true);
        setShowGameinfoList(false);
    };
    
    const handleHideUserStoryList = () => {
        setShowUserStoryList(false);
    };

    const toggleFollow = () => {
        const toUserId = profile.user_id;

        if (isFollowing) {
            axios
                .post(`/account/unfollow/`, {to_user: toUserId})
                .then((response) => {
                    setIsFollowing(false);
                    console.log('unfollow')
                })
                .catch((error) => {
                    console.error('언팔로우 요청 중 오류 발생:', error);
                });
        } else {
            axios
                .post(`/account/follow/`, {to_user: toUserId})
                .then((response) => {
                    setIsFollowing(true);
                    console.log('follow')
                })
                .catch((error) => {
                    console.error('팔로우 요청 중 오류 발생:', error);
                });
        }
    };

    return (
        <div className="container mt-5" style={{ color: "white" }}>
            <div className="row">
                <div className="col-md-2">
                    <div className="d-flex flex-column align-items-center">
                        <Image
                            src={profile.image_url}
                            roundedCircle
                            width={130}
                            height={130}
                            border={3}
                            alt="프로필 이미지"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h2><strong>{profile.nickname}</strong></h2>
                            <Button variant="primary" onClick={openModal}>편집</Button>
                        </div>
                        <p style={{ color: '#808080', fontWeight: 'lighter' }}>@{user.user_id}</p>
                    </div>
                </div>
            </div>
            <div>
            {userInfo && userInfo.winrate !== 0 && (
                <Card style={{ width: '35rem' }}>
                    <Card.Body>
                        {/* <img src={userInfo.tierImageUrl} alt={userInfo.tier} /> */}
                    <Card.Title></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{userInfo.summonerName} {userInfo.tier} {userInfo.rank}  / 승률: {userInfo.winrate}%</Card.Subtitle>
                    </Card.Body>
                </Card>
            )}
            </div>

            <div className="button-container">
                <div className={`button ${showFollowerList ? 'active' : ''}`}
                    onClick={() => {
                        if (showFollowerList) {
                            handleHideFollowerList();
                        } else {
                            handleShowFollowerList();
                        }
                    }}
                    style={{cursor: 'pointer'}}
                >
                    팔로워 {follower.follower_count}
                </div>
                <div className={`button ${showFollowingList ? 'active' : ''}`}
                    onClick={() => {
                        if (showFollowingList) {
                            handleHideFollowingList();
                        } else {
                            handleShowFollowingList();
                        }
                    }}
                    style={{cursor: 'pointer'}}
                >
                    팔로잉 {following.following_count}
                </div>
                {showFollowerList && <FollowerList/>}
                {showFollowingList && <FollowingList/>}
                <div className={`button ${showUserStoryList ? 'active' : ''}`}
                    onClick={() => {
                        if (showUserStoryList) {
                            handleHideUserStoryList();
                        } else {
                            handleShowUserStoryList();
                        }
                    }}
                    style={{cursor: 'pointer'}}
                >
                    이야기 {}
                </div>
                <div className={`button ${showGameinfoList ? 'active' : ''}`}
                    onClick={() => {
                        if (showGameinfoList) {
                            handleHideGameinfoList();
                        } else {
                            handleShowGameinfoList();
                        }
                    }}
                    style={{cursor: 'pointer'}}
                >
                    연동하기
                </div>
            </div>

            <ProfileFormModal showModal={showModal} closeModal={closeModal} profileData={profile}
                              onSave={handleSaveModal}/>

            {showGameinfoList && (
            <div>
                <Button variant="primary" onClick={openLOLModal}>리그오브레전드</Button>
                <Modal show={showLOLModal} onHide={closeLOLModal}>
                <Modal.Header closeButton>
                    <Modal.Title>리그오브레전드 계정 연동</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    현재시즌 랭크게임을 진행한 유저님 반갑습니다
                    <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="닉네임"
                        value={modalInputValue}
                        onChange={handleModalInputChange}
                    />
                    </Form.Group>
                    <Button
                    variant="primary"
                    onClick={handleConnectClick}
                    >
                        연동하기
                    </Button>
                </Modal.Body>
                </Modal>
            </div>
            )}
        </div>
    );
}

export default UserProfile;