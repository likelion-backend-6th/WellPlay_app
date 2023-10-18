import React, {useEffect, useState} from 'react';
import {Button, Image, Form, Spinner, Card, Modal, Row} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser, useUserActions} from '../../hooks/user.actions';
import {serverUrl} from '../../config'
import axios from 'axios';
import ProfileFormModal from "./ProfileFormModal";
import {Link, useNavigate, useParams} from "react-router-dom";
import FollowerList from "../follow/Follower"
import FollowingList from "../follow/Following"
import "../profile.css"
import Feed from "../feeds/Feed";


function UserProfile(props) {
    const {getProfile, getFollowing, getFollower,
        apiPostLol, apiGetLol, apiPostVal, apiGetVal, apiPostFc, apiGetFc } = useUserActions();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showLOLModal, setShowLOLModal] = useState(false);
    const [showVALModal, setShowVALModal] = useState(false);
    const [showFCModal, setShowFCModal] = useState(false);
    
    const [showFollowerList, setShowFollowerList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [showGameinfoList, setShowGameinfoList] = useState(false);
    const [showUserStoryList, setShowUserStoryList] = useState(true);

    const navigate = useNavigate();
    const {profileId} = useParams();
    const [previousRequestTime, setPreviousRequestTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0); // 남은 시간 상태 추가
    const [timerId, setTimerId] = useState(null); // 타이머 ID 상태 추가
    const [userInfolol, setUserInfolol] = useState(null);
    const [userInfoval, setUserInfoval] = useState(null);
    const [userInfofc, setUserInfofc] = useState(null);

    const [modalInputValue, setModalInputValue] = useState("");
    const [modalInputValueValName, setModalInputValueValName] = useState("");
    const [modalInputValueValTag, setModalInputValueValTag] = useState("");
    const [modalInputValueFcName, setModalInputValueFcName] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [feeds, setFeeds] = useState([]);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

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

    const fetchFeeds = () => {
        try {
            const apiUrl = `${serverUrl}/feed/userfeed/${profileId}`;

            axios.get(apiUrl)
                .then((response) => {
                    const data = response.data;
                    setFeeds(data);
                })
                .catch((error) => {
                    console.error('피드를 가져오는 중 오류 발생:', error);
                });
        } catch (error) {
            console.error('API 요청 오류:', error);
        }
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

    const openVALModal = () => {
        setShowVALModal(true);
    };
    
    const closeVALModal = () => {
        setShowVALModal(false);
    };

    const openFCModal = () => {
        setShowFCModal(true);
    }

    const closeFCModal = () => {
        setShowFCModal(false);
    }

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

        setTimeout(() => {
            fetchProfile(profileId);
        }, 2000);
    };

    const handleConnectVALClick = () => {
        if (remainingTime > 0) {
            return;
        }
        const now = Date.now();
        setPreviousRequestTime(now);
        setIsLoading(true);

        const newValName = modalInputValueValName;
        const newValTag = modalInputValueValTag;
        const requestData = { val_name: newValName, val_tag: newValTag  };

        apiPostVal(requestData)
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
        });

        setTimeout(() => {
            fetchProfile(profileId);
        }, 2000);
    };

    const handleConnectFCClick = () => {
        if (remainingTime > 0) {
            return;
        }
        const now = Date.now();
        setPreviousRequestTime(now);
        setIsLoading(true);

        const newFcName = modalInputValueFcName;
        const requestData = { fc_name: newFcName};

        apiPostFc(requestData)
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
        });

        setTimeout(() => {
            fetchProfile(profileId);
        }, 2000);
    };

    useEffect(() => {
        // 프로필 정보를 가져오기
        fetchProfile();

        fetchFeeds();

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
                setUserInfolol(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });

        apiGetVal(profileId) // 유저의 val 정보를 불러옵니다
            .then((response) => {
                setUserInfoval(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });

        apiGetFc(profileId) // 유저의 fc 정보를 불러옵니다
            .then((response) => {
                setUserInfofc(response.data);
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
    const handleModalInputChangeValName = (e) => {
        setModalInputValueValName(e.target.value);
        setError(null);
    };
    const handleModalInputChangeValTag = (e) => {
        setModalInputValueValTag(e.target.value);
        setError(null);
    }

    const handleModalInputChangeFcName = (e) => {
        setModalInputValueFcName(e.target.value);
        setError(null);
    }

    const handleShowFollowerList = () => {
        setShowFollowerList(true);
        setShowFollowingList(false);
        setShowGameinfoList(false);
        setShowUserStoryList(false);
    };
    const handleShowFollowingList = () => {
        setShowFollowingList(true);
        setShowFollowerList(false);
        setShowGameinfoList(false);
        setShowUserStoryList(false);
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

    const openFollowerModal = () => {
        setShowFollowerModal(true);
    };

    const openFollowingModal = () => {
        setShowFollowingModal(true);
    };

    const closeFollowerModal = () => {
        setShowFollowerModal(false);
    };

    const closeFollowingModal = () => {
        setShowFollowingModal(false);
    };

    return (
        <div className="container" style={{ color: "white" }}>
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
                <div className="col-md-10">
                    <div className="d-flex flex-column">
                        <div className="d-flex align-items-center justify-content-between mb-3 edit-button">
                            <h2><strong>{profile.nickname}</strong></h2>
                            <Button variant="primary" onClick={openModal}>프로필 편집</Button>
                        </div>
                        <p style={{ color: '#808080', fontWeight: 'lighter' }}>@{user.user_id}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <div className='lol-card-container'>
                {userInfolol && userInfolol.tier && (
                    <Card className="custom-card-style" style={{ width: '35rem' }}>
                        <Card.Body>
                        <img src={`/media/lol/${userInfolol.tier.toLowerCase()}.png`} style={{ width: '50px', height: '50px' }} /> {userInfolol.summonerName} {userInfolol.tier} {userInfolol.rank} 승률: {userInfolol.winrate}%
                        </Card.Body>
                    </Card>
                )}
                </div>
                <div className='val-card-container'>
                {userInfoval && userInfoval.val_tag && (
                    <Card className="custom-card-style" style={{ width: '35rem' }}>
                        <Card.Body>
                        <img src={`/media/val/val.png`} style={{ width: '50px', height: '50px' }} /> {userInfoval.val_name} #{userInfoval.val_tag}
                        </Card.Body>
                    </Card>
                )}
                </div>
                <div className='fc-card-container'>
                {userInfofc && userInfofc.fc_division && (
                    <Card className="custom-card-style" style={{ width: '35rem' }}>
                        <Card.Body>
                        <img src={`/media/fc/${userInfofc.fc_division}.png`} style={{ width: '50px', height: '50px' }} /> {userInfofc.fc_name} Lv.{userInfofc.fc_level}
                        </Card.Body>
                    </Card>
                )}
                </div>
            </div>
            
            <div className="button-container list-button">
                <div className={`button ${showFollowerList ? 'active' : ''}`} onClick={openFollowerModal} style={{cursor: 'pointer'}}>
                    팔로워 {follower.follower_count}
                </div>
                <div className={`button ${showFollowingList ? 'active' : ''}`} onClick={openFollowingModal} style={{cursor: 'pointer'}}>
                    팔로잉 {following.following_count}
                </div>
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
                    이야기 {feeds.feed_count}

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
            {showFollowerModal &&
                <div>
                    <Modal show={showFollowerModal} onHide={closeFollowerModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>팔로워</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <ul>
                            {follower.follower_list.map((followerItem) => (
                              <li key={followerItem.id}>
                                <Link to={`/profile/${followerItem.from_user}`}>
                                  {followerItem.from_user}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Modal.Body>
                        <Modal.Footer>
                          <button onClick={closeFollowerModal}>x</button>
                        </Modal.Footer>
                      </Modal>
                </div>}
            {showFollowingModal &&
                <div>
                    <Modal show={showFollowingModal} onHide={closeFollowingModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>팔로잉</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <ul>
                            {following.following_list.map((followingItem) => (
                              <li key={followingItem.id}>
                                <Link to={`/profile/${followingItem.to_user}`}>
                                  {followingItem.to_user}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Modal.Body>
                        <Modal.Footer>
                          <button onClick={closeFollowingModal}>x</button>
                        </Modal.Footer>
                      </Modal>
                </div>}
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
                <Button variant="primary" onClick={openVALModal}>발로란트</Button>
                    <Modal show={showVALModal} onHide={closeVALModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>발로란트 계정 연동</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        발로란트를 즐기시는 요원님 반갑습니다
                        <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="ID"
                            value={modalInputValueValName}
                            onChange={handleModalInputChangeValName}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Tag(#빼고 입력)"
                            value={modalInputValueValTag}
                            onChange={handleModalInputChangeValTag}
                        />
                        </Form.Group>
                        <Button
                        variant="primary"
                        onClick={handleConnectVALClick}
                        >
                            연동하기
                        </Button>
                    </Modal.Body>
                    </Modal>
                <Button variant="primary" onClick={openFCModal}>FC온라인</Button>
                    <Modal show={showFCModal} onHide={closeFCModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>FC온라인 계정 연동</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        FC온라인을 즐기시는 감독님 반갑습니다
                        <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="감독명"
                            value={modalInputValueFcName}
                            onChange={handleModalInputChangeFcName}
                        />
                        </Form.Group>
                        <Button
                        variant="primary"
                        onClick={handleConnectFCClick}
                        >
                            연동하기
                        </Button>
                    </Modal.Body>
                    </Modal>
            </div>
            )}
            {feeds && feeds.feed_count > 0 ? (
                <div>
                    <Row className="my-4">
                        {feeds.feeds.map((feed, index) => (
                            <Feed key={index} feed={feed} refresh={fetchFeeds} />
                        ))}
                    </Row>
                </div>
            ) : (
                <div></div>
            )}
            <ProfileFormModal showModal={showModal} closeModal={closeModal} profileData={profile}
                              onSave={handleSaveModal}/>
        </div>
    );
}

export default UserProfile;