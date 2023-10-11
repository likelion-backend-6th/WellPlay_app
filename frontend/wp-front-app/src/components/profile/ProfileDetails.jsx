import React, {useEffect, useState} from 'react';
import {Button, Image, Form, Spinner} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser, useUserActions} from '../../hooks/user.actions';
import {serverUrl} from '../../config'
import axios from 'axios';
import ProfileFormModal from "./ProfileFormModal";
import {useNavigate, useParams} from "react-router-dom";


function UserProfile(props) {
    const {getUserProfile, getFollowing, getFollower, updateUsernameLol, apiUsernameLol } = useUserActions();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const {profileId} = useParams();
    const [previousRequestTime, setPreviousRequestTime] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0); // 남은 시간 상태 추가
    const [timerId, setTimerId] = useState(null); // 타이머 ID 상태 추가

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const user = getUser();

    const fetchProfile = (profileId) => {
        getUserProfile(profileId)
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
        apiUsernameLol(requestData)
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

        return () => {
            // 컴포넌트가 언마운트되면 타이머 해제
            if (timerId) {
                clearInterval(timerId);
            }
        }
    }, [previousRequestTime]);

    useEffect(() => {
        // 프로필 정보를 가져오기
        fetchProfile(profileId);

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
    }, []);

    const goFollowerList = () => {
        navigate('/follower');
    };

    const goFollowingList = () => {
        navigate('/following');
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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-2">
                    <div className="d-flex flex-column align-items-center">
                        <Image
                            src={profile.image_url}
                            roundedCircle
                            width={100}
                            height={100}
                            border={3}
                            alt="프로필 이미지"
                        />
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="border-bottom pb-3">
                        <h2 className="mb-3">{profile.nickname}</h2>
                        <p>
                            <strong>@{user.user_id}</strong> <Button onClick={toggleFollow}
                                                                     size="sm">{isFollowing ? '언팔로우' : '팔로우'}</Button>
                        </p>
                    </div>
                </div>
                <div className="col-md-2">
                    {/* 오른쪽 끝에 버튼 추가 */}
                    <Button variant="primary" onClick={openModal}>편집</Button>
                </div>
            </div>
            <div>
                <span onClick={goFollowerList} style={{cursor: 'pointer'}}>
                    &nbsp; 팔로워 {follower.follower_count}
                </span>
                <span onClick={goFollowingList} style={{cursor: 'pointer'}}>
                    &nbsp; 팔로잉 {following.following_count}
                </span>
            </div>
            <ProfileFormModal showModal={showModal} closeModal={closeModal} profileData={profile}
                              onSave={handleSaveModal}/>

            {/* 연동하기 텍스트 필드와 버튼 */}
            <Form.Group>
                <Form.Control
                    type="text"
                    placeholder="닉네임"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Button variant="primary" onClick={handleConnectClick} disabled={remainingTime > 0 || isLoading}>
                {remainingTime > 0 ? `남은 시간: ${Math.ceil(remainingTime / 1000)}초` : (isLoading ? (
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                    '연동하기'
                ))}
            </Button>
        </div>
    );
}

export default UserProfile;