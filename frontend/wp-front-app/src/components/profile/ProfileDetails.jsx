import React, {useEffect, useState} from 'react';
import {Button, Image} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser, useUserActions} from '../../hooks/user.actions';
import {serverUrl} from '../../config'
import axios from 'axios';
import ProfileFormModal from "./ProfileFormModal";


function UserProfile(props) {
    const {getProfile, getFollowing, getFollower} = useUserActions();
    const user = getUser();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);
    const [showModal, setShowModal] = useState(false);

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

    useEffect(() => {
        // 프로필 정보를 가져오기
        getProfile()
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error('프로필 정보를 가져오는 중 오류 발생:', error);
            });

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

        if(isFollowing) {
            axios
                .post(`/account/unfollow/`, { to_user: toUserId })
                .then((response) =>
                    {setIsFollowing(false);
                    console.log('unfollow')
                })
                .catch((error) => {
                    console.error('언팔로우 요청 중 오류 발생:', error);
                });
        } else {
            axios
                .post(`/account/follow/`, { to_user: toUserId })
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
                            border = {3}
                            alt="프로필 이미지"
                        />
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="border-bottom pb-3">
                        <h2 className="mb-3">{profile.nickname}</h2>
                        <p>
                            <strong>@{user.user_id}</strong> <Button onClick={toggleFollow} size="sm">{isFollowing ? '언팔로우' : '팔로우'}</Button>
                        </p>
                    </div>
                </div>
                <div className="col-md-2">
                    {/* 오른쪽 끝에 버튼 추가 */}
                    <Button variant="primary" onClick={openModal}>편집</Button>
                </div>
            </div>
            <div>
                <span onClick={goFollowerList} style={{ cursor: 'pointer' }}>
                    &nbsp; 팔로워 {follower.follower_count}
                </span>
                <span onClick={goFollowingList} style={{ cursor: 'pointer' }}>
                    &nbsp; 팔로잉 {following.following_count}
                </span>
            </div>
            <ProfileFormModal showModal={showModal} closeModal={closeModal} profileData={profile} onSave={handleSaveModal} />
        </div>
    );
}


export default UserProfile;