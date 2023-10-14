import {getUser, useUserActions} from "../../hooks/user.actions";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Button, Form, Image, Card} from "react-bootstrap";
import ProfileFormModal from "./ProfileFormModal";
import UserFollowerList from "../follow/UserFollower";
import UserFollowingList from "../follow/UserFollowing";
import FollowingList from "../follow/Following";
import axiosService from "../../helpers/axios";

function UserProfile() {
    const {getUserProfile, getUserFollowing, getUserFollower, apiGetLol} = useUserActions();
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
    const baseURL = process.env.REACT_APP_API_URL;

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
    useEffect(() => {
        // 프로필 정보를 가져오기
        fetchProfile(profileId);

        getUserFollower(profileId)
            .then((response) => {
                setFollower(response.data);
            })
            .catch((error) => {
                console.error('팔로워 정보를 가져오는 중 오류 발생:', error);
            })

        getUserFollowing(profileId)
            .then((response) => {
                setFollowing(response.data);
            })
            .catch((error) => {
                console.error('팔로잉 정보를 가져오는 중 오류 발생:', error);
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
        const toUserId = profileId;
        const followURL = `${baseURL}/account/follow/${toUserId}/`
        const unfollowURL = `${baseURL}/account/follow/${toUserId}/`
        console.log(followURL)
        console.log(unfollowURL)

        if (isFollowing) {
            axiosService
                .post(unfollowURL, { to_user: profileId })
                .then((response) => {
                    setIsFollowing(false);
                    console.log('unfollow')
                })
                .catch((error) => {
                    console.error('언팔로우 요청 중 오류 발생:', error);
                });
        } else {
            axiosService
                .post(followURL, { to_user: profileId })
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
                {userInfo && userInfo.winrate !== 0 && (
                    <Card style={{ width: '35rem' }}>
                        <Card.Body>
                            {/* <img src={userInfo.tierImageUrl} alt={userInfo.tier} /> */}
                        <Card.Title></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{userInfo.summonerName} {userInfo.tier} {userInfo.rank}  / 승률: {userInfo.winrate}%</Card.Subtitle>
                        </Card.Body>
                    </Card>
                )}
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
                    {showFollowerList && <UserFollowerList/>}
                    {showFollowingList && <UserFollowingList/>}
                </div>
            </div>



        </div>
    )
}

export default UserProfile;