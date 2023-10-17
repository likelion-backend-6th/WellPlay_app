import {getUser, useUserActions} from "../../hooks/user.actions";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Button, Form, Image, Card, Row, Modal} from "react-bootstrap";
import ProfileFormModal from "./ProfileFormModal";
import UserFollowerList from "../follow/UserFollower";
import UserFollowingList from "../follow/UserFollowing";
import FollowingList from "../follow/Following";
import axiosService from "../../helpers/axios";
import {serverUrl} from "../../config";
import Feed from "../feeds/Feed";

function UserProfile() {
    const {getUserProfile, getUserFollowing, getUserFollower, apiGetLol, apiGetVal} = useUserActions();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showFollowerList, setShowFollowerList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [showUserStoryList, setShowUserStoryList] = useState(true);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [feeds, setFeeds] = useState([]);

    const navigate = useNavigate();

    const {profileId} = useParams();
    const [userInfolol, setUserInfolol] = useState(null);
    const [userInfoval, setUserInfoval] = useState(null);
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

    useEffect(() => {
        // 프로필 정보를 가져오기
        fetchProfile(profileId);

        fetchFeeds();

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
                setUserInfolol(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });

        apiGetVal(profileId) // 유저의 val 정보를 불러옵니다
            .then((response) => {
                console.log(profile.id)
                setUserInfoval(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });

    }, [profileId]);

    const handleShowUserStoryList = () => {
        setShowUserStoryList(true);
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

    const toggleFollow = () => {
        const toUserId = profileId;
        const followURL = `${baseURL}/account/follow/${toUserId}/`
        const unfollowURL = `${baseURL}/account/follow/${toUserId}/`
        console.log(followURL)
        console.log(unfollowURL)

        if (isFollowing) {
            axiosService
                .post(unfollowURL, {to_user: profileId})
                .then((response) => {
                    setIsFollowing(false);
                    console.log('unfollow')
                })
                .catch((error) => {
                    console.error('언팔로우 요청 중 오류 발생:', error);
                });
        } else {
            axiosService
                .post(followURL, {to_user: profileId})
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
                            width={130}
                            height={130}
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
                
                <div>
                    <div className='lol-card-container'>
                    {userInfolol && userInfolol.tier && (
                        <Card style={{ width: '35rem' }}>
                            <Card.Body>
                            <img src={`/media/lol/${userInfolol.tier.toLowerCase()}.png`} style={{ width: '50px', height: '50px' }} /> {userInfolol.summonerName} {userInfolol.tier} {userInfolol.rank} 승률: {userInfolol.winrate}%
                            </Card.Body>
                        </Card>
                    )}
                    </div>
                    <div className='val-card-container'>
                    {userInfoval && userInfoval.val_tag && (
                        <Card style={{ width: '35rem' }}>
                            <Card.Body>
                            <img src={`/media/val/val.png`} style={{ width: '50px', height: '50px' }} /> {userInfoval.val_name} #{userInfoval.val_tag}
                            </Card.Body>
                        </Card>
                    )}
                    </div>
                </div>

                {user ? (
                    <div className="col-md-2">
                        <Button onClick={toggleFollow} variant="danger">{isFollowing ? '언팔로우' : '팔로우'}</Button>
                    </div>
                ):(
                    <div>
                        
                    </div>
                )};
            </div>
            <div className="container mt-5">
                <div className="button-container">
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
                         style={{cursor: 'pointer'}}>
                        이야기 {feeds.feed_count}
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
                </div>
            </div>


        </div>
    )
}

export default UserProfile;