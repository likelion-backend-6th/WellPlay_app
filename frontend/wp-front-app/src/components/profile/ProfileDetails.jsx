import React, {useEffect, useState} from 'react';
import {Button, Image, Form, Spinner} from 'react-bootstrap';
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

    const [inputValue, setInputValue] = useState("");
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

    const handleSaveModal = () => {
        closeModal();
        fetchProfile();
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setError(null);
    };

    const handleConnectClick = () => {
        if (remainingTime > 0) {
            return;
        }
        const now = Date.now();
        setPreviousRequestTime(now);
        setIsLoading(true);

        const newLolName = inputValue;
        const requestData = { summoner_name: newLolName };
        console.log("연동하기 버튼을 클릭하였습니다. 닉네임: ", newLolName);

        // 백그라운드 작업 시작을 서버에 요청
        apiPostLol(requestData)
            .then((response) => {
            setSuccessMessage(response.data.message);
            })
            .catch((error) => {
            setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
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



    // 클릭 시간을 확인하여 중복 클릭 방지
    useEffect(() => {
        const now = Date.now();
        if (previousRequestTime !== null && now - previousRequestTime < 60000) {
            const timeDiff = 120000 - (now - previousRequestTime);
            setRemainingTime(timeDiff);

            // 1초마다 남은 시간 갱신
            const id = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1000);
            }, 1000);

            setTimerId(id);
        } else {
            setRemainingTime(0);
        }

        // return () => {
        //     // 컴포넌트가 언마운트되면 타이머 해제
        //     if (timerId) {
        //         clearInterval(timerId);
        //     }
        // }
    }, [previousRequestTime]);

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
                    <div className="border-bottom pb-3"></div>
                </div>
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
            </div>
            <div className="button-container">
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
                    유저의 이야기
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
                    연동된 프로필
                </div>
            </div>

            <ProfileFormModal showModal={showModal} closeModal={closeModal} profileData={profile}
                              onSave={handleSaveModal}/>

            {showGameinfoList && (
            <div>
                <div className="user-profile-info">
                    {userInfo && (
                        <div className="user-info-box">
                            {/* <img src={userInfo.tierImageUrl} alt={userInfo.tier} /> */}
                            <div>
                                <p>{userInfo.summonerName}</p>
                                <p>{userInfo.tier} {userInfo.rank}</p>
                                <p>승률: {userInfo.winrate}%</p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="닉네임"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={handleConnectClick}
                        disabled={remainingTime > 0 || isLoading}
                    >
                        {remainingTime > 0
                            ? `남은 시간: ${Math.ceil(remainingTime / 1000)}초`
                            : isLoading
                            ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            : '연동하기'}
                    </Button>
                </div>
            </div>
            )}
        </div>
    );
}

export default UserProfile;