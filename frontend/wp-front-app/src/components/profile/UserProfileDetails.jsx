import {getUser, useUserActions} from "../../hooks/user.actions";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Button, Form, Image, Card, Row, Modal} from "react-bootstrap";
import axiosService from "../../helpers/axios";
import {serverUrl} from "../../config";
import Feed from "../feeds/Feed";
import "../profile.css"

function UserProfile() {
    const {getUserProfile, getUserFollowing, getUserFollower, apiGetLol, apiGetVal, apiGetFc} = useUserActions();
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
    const [userInfofc, setUserInfofc] = useState(null);
    const [error, setError] = useState(null);
    const baseURL = process.env.REACT_APP_API_URL;

    const user = getUser();

    const [check, setCheck] = useState(false);

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

        apiGetFc(profileId) // 유저의 Fc 정보를 불러옵니다
            .then((response) => {
                setUserInfofc(response.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.message : '서버 오류');
            })
            .finally(() => {
            });

    }, [profileId, check]);

    useEffect(() => {
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
    }, [check]);

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
        const followURL = `${baseURL}/account/follow/${profileId}/`

        axiosService
            .post(followURL, {to_user: profileId})
            .then((response) => {
                fetchProfile(profileId);
            })
            .catch((error) => {
                console.error('팔로우 요청 중 오류 발생:', error);
            });
        setCheck(!check)
    };

    return (
        <div className="profile-container" style={{color: "white"}}>
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
                        <div className="d-flex align-items-center justify-content-between mb-3 follow-button">
                            <h2><strong>{profile.nickname}</strong></h2>
                            {user ? (
                                <Button onClick={toggleFollow} variant="danger">
                                    {follower.follower_users && user.user_id && follower.follower_users.includes(user.user_id) ? '언팔로우' : '팔로우'}
                                </Button>
                            ) : (
                                <div>

                                </div>
                            )}
                        </div>
                        <p style={{color: '#808080', fontweight: 'lighter'}} className="userid">@{profileId}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className='val-card-container'>
                    {userInfolol && userInfolol.summonerName && !userInfolol.tier && (
                        <Card className="custom-card-style" style={{ width: '30rem' }}>
                            <Card.Body>
                            <img src={`/media/lol/unrank.png`} style={{ width: '50px', height: '50px' }} /> {userInfolol.summonerName}
                            </Card.Body>
                        </Card>
                    )}
                </div>
                <div className='val-card-container'>
                    {userInfolol && userInfolol.tier && (
                        <Card className="custom-card-style" style={{ width: '30rem' }}>
                            <Card.Body>
                            <img src={`/media/lol/${userInfolol.tier.toLowerCase()}.png`} style={{ width: '50px', height: '50px' }} /> {userInfolol.summonerName} {userInfolol.tier} {userInfolol.rank} {userInfolol.lp} {userInfolol.winrate}%
                            </Card.Body>
                        </Card>
                    )}
                </div>
                <div className='val-card-container'>
                    {userInfoval && userInfoval.val_tag && (
                        <Card className="custom-card-style" style={{width: '30rem'}}>
                            <Card.Body>
                                <img src={`/media/val/val.png`} style={{
                                    width: '50px',
                                    height: '50px'
                                }}/> {userInfoval.val_name} #{userInfoval.val_tag}
                            </Card.Body>
                        </Card>
                    )}
                </div>
                <div className='fc-card-container'>
                    {userInfofc && userInfofc.fc_division && (
                        <Card className="custom-card-style" style={{width: '30rem'}}>
                            <Card.Body>
                                <img src={`/media/fc/${userInfofc.fc_division}.png`} style={{
                                    width: '50px',
                                    height: '50px'
                                }}/> {userInfofc.fc_name} Lv.{userInfofc.fc_level}
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>

            <div className="button-container user-button">
                <div className={`button ${showFollowerList ? 'active' : ''}`} onClick={openFollowerModal}
                     style={{cursor: 'pointer', width: '60%'}}>
                    팔로워 {follower.follower_count}
                </div>
                <div className={`button ${showFollowingList ? 'active' : ''}`} onClick={openFollowingModal}
                     style={{cursor: 'pointer', width: '60%'}}>
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
                     style={{cursor: 'pointer', width: '60%'}}
                >
                    이야기 {feeds.feed_count}
                </div>
            </div>
            {showFollowerModal &&
                <div>
                    <Modal show={showFollowerModal} onHide={closeFollowerModal} className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>팔로워</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ul>
                                {follower.follower_list.map((followerItem) => (
                                    <li key={followerItem.id}>
                                        <Link to={`/profile/${followerItem.from_user}`}>
                                            <Image
                                                src={followerItem.profile_image}
                                                roundedCircle
                                                width={48}
                                                height={48}
                                                className="me-2 border border-dark border-2"
                                            />
                                        </Link>
                                        {followerItem.from_user}
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
                    <Modal show={showFollowingModal} onHide={closeFollowingModal} className="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>팔로잉</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ul>
                                {following.following_list.map((followingItem) => (
                                    <li key={followingItem.id}>
                                        <Link to={`/profile/${followingItem.to_user}`}>
                                            <Image
                                                src={followingItem.profile_image}
                                                roundedCircle
                                                width={48}
                                                height={48}
                                                className="me-2 border border-dark border-2"
                                            />
                                        </Link>
                                        {followingItem.to_user}
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
                <div style={{width: '30em'}}>
                    <Row className="my-4">
                        {feeds.feeds.map((feed, index) => (
                            <Feed key={index} feed={feed} refresh={fetchFeeds}/>
                        ))}
                    </Row>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default UserProfile;