import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';
import {useParams, Link} from "react-router-dom";

function UserFollowerList() {
    const {getUserFollower} = useUserActions();
    const [follower, setFollower] = useState([]);
    const [loading, setLoading] = useState(true);
    const {profileId} = useParams()
    const loadFollowerData = () => {
        setLoading(true);
        getUserFollower(profileId)  // getUserFollower 함수를 사용하여 특정 유저의 팔로워 목록을 가져옵니다.
            .then((response) => {
                const followerList = response.data.follower_list || [];
                setFollower(followerList);
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
            <h2>특정 유저의 팔로워 목록</h2>
            {loading ? (
                '로딩 중...'
            ) : (
                <div>
                    <ul>
                        {follower.map((followerItem) => (
                            <li key={followerItem.id}>
                                <Link to={`/profile/${followerItem.from_user}`}>
                                    {followerItem.from_user}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserFollowerList;