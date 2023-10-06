import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Image} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser, useUserActions} from '../../hooks/user.actions';
import {serverUrl} from '../../config'


function UserProfile(props) {
    const {getProfile, getFollowing, getFollower} = useUserActions();
    const user = getUser();
    const [profile, setProfile] = useState({});
    const [following, setFollowing] = useState({});
    const [follower, setFollower] = useState({});

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
                            alt="프로필 이미지"
                        />
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="border-bottom pb-3">
                        <h2 className="mb-3">{profile.nickname}</h2>
                        <p>
                            <strong>@{user.user_id}</strong>
                        </p>
                        {/* 다른 프로필 정보 필드를 추가할 수 있음 */}
                    </div>
                </div>
            </div>
            <div> &nbsp; 팔로워 {following.following_count} &nbsp; 팔로잉 {follower.follower_count}</div>
        </div>
    );
}


export default UserProfile;