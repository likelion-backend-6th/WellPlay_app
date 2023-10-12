import {useUserActions} from "../../hooks/user.actions";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Button, Form, Image, Spinner} from "react-bootstrap";
import ProfileFormModal from "./ProfileFormModal";
import FollowerList from "../follow/Follower";
import FollowingList from "../follow/Following";

function UserProfile() {
    const {getUserProfile, getFollowing, getFollower,
        apiGetLol} = useUserActions();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showFollowerList, setShowFollowerList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const navigate = useNavigate();
    const {profileId} = useParams();

    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    const fetchProfile = (profileId) => {
        getUserProfile(profileId)
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });
    };
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
    }

    const handleHideFollowingList = () => {
        setShowFollowingList(false);
    }
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
                            <strong>@{profileId}</strong>
                        </p>
                    </div>
                </div>
                <div className="col-md-2">
                    <Button onClick={toggleFollow} variant="danger">{isFollowing ? '언팔로우' : '팔로우'}</Button>
                </div>
            </div>
            <div className="container mt-5">
                <div className="button-container">
                    <div className={`button ${showFollowerList ? 'active' : ''}`}
                         onClick={() => {
                             if (showFollowerList) {
                                 handleHideFollowerList();
                             } else {
                                 handleShowFollowerList();
                             }
                         }}
                         style={{cursor: 'pointer'}}>
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
                         style={{cursor: 'pointer'}}>
                        팔로잉 {following.following_count}
                    </div>
                    {showFollowerList && <FollowerList/>}
                    {showFollowingList && <FollowingList/>}
                </div>
            </div>

            {/* LOL API 불러오는 부분 */}
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



        </div>        
    )
}

export default UserProfile;