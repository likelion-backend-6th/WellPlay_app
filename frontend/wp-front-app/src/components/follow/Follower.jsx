import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';

function FollowerList() {
    const {getFollower} = useUserActions();
    const [follower, setFollower] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFollower()
            .then((response) => {
                const followerList = response.data.follower_list || [];
                setFollower(followerList);
                setLoading(false);
            })
            .catch((error) => {
                console.error('팔로워 목록을 가져오는 중 오류 발생:', error);
            });
    }, [getFollower]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>팔로워</h2>
            <ul>
                {follower.map((followerItem) => (
                    <li key={follower.id}>{followerItem.from_user}</li>
                ))}
            </ul>
        </div>
    );
}

export default FollowerList;