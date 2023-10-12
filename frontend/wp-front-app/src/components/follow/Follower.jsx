import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';

function FollowerList() {
    const {getFollower} = useUserActions();
    const [follower, setFollower] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFollowerData = () => {
        setLoading(true);
        getFollower()
            .then((response) => {
                const followerList = response.data.follower_list || [];
                setFollower(followerList);
            })
            .catch((error) => {
                console.error('팔로워 목록을 가져오는 중 오류 발생:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadFollowerData()
    }, []);

    return (
        <div className="container mt-5">
            <h2>팔로워</h2>
            {loading ? ('') : (
                <div>
                    <ul>{follower.map((followerItem) => (
                        <li key={followerItem.id}>{followerItem.from_user}</li>
                    ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FollowerList;