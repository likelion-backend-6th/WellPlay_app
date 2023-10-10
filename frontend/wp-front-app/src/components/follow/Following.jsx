import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';

function FollowingList() {
    const {getFollowing} = useUserActions();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFollowing()
            .then((response) => {
                const followingList = response.data.following_list || [];
                setFollowing(followingList);
                setLoading(false);
            })
            .catch((error) => {
                console.error('팔로워 목록을 가져오는 중 오류 발생:', error);
            });
    }, [getFollowing]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>팔로잉</h2>
            <ul>
                {following.map((followingItem) => (
                    <li key={following.id}>{followingItem.to_user}</li>
                ))}
            </ul>
        </div>
    );
}

export default FollowingList;