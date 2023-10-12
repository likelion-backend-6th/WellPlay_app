import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';
import {useParams} from "react-router-dom";

function UserFollowingList() {
    const {getUserFollowing} = useUserActions();
    const [follower, setFollower] = useState([]);
    const [loading, setLoading] = useState(true);
    const {profileId} = useParams()
    const loadFollowerData = () => {
        setLoading(true);
        getUserFollowing(profileId)  // getUserFollower 함수를 사용하여 특정 유저의 팔로워 목록을 가져옵니다.
            .then((response) => {
                const followingList = response.data.following_list || [];
                setFollower(followingList);
            })
            .catch((error) => {
                console.error('특정 유저의 팔로워 목록:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadFollowerData();
    }, [profileId]);

    return (
        <div className="container mt-5">
            <h2>특정 유저의 팔로잉 목록</h2>
            {loading ? (
                '로딩 중...'
            ) : (
                <div>
                    <ul>
                        {follower.map((followingItem) => (
                            <li key={followingItem.id}>{followingItem.from_user}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserFollowingList;