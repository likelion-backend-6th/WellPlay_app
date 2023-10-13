import React, {useEffect, useState} from 'react';
import {useUserActions} from '../../hooks/user.actions';

function FollowingList() {
    const {getFollowing} = useUserActions();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFollowingData = () => {
        setLoading(true);
        getFollowing()
            .then((response) => {
                const followingList = response.data.following_list || [];
                setFollowing(followingList);
            })
            .catch((error) => {
                console.error('팔로잉 목록을 가져오는 중 오류 발생:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadFollowingData()
    }, []);

    return (
        <div className="container mt-5">
            <h2>팔로잉</h2>
            {loading ? ('') : (
                <div>
                    <ul>{following.map((followingItem) => (
                        <li key={followingItem.id}>{followingItem.to_user}</li>
                    ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FollowingList;