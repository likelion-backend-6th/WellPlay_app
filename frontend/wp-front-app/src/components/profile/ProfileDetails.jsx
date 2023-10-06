import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Image} from 'react-bootstrap';
import axiosService from "../../helpers/axios";
import {getUser} from '../../hooks/user.actions';
import {serverUrl} from '../../config'

// function ProfileDetails(props) {
//   const {user} = props;
//   const navigate = useNavigate();
//
//   if(!user) {
//     return <div>Loading!</div>
//   }
//
//   return (
//     <div>
//       <div className="d-flex flex-row border-bottom p-5">
//         <Image
//             src={user.avatar}
//             roundedCircle
//             width={120}
//             height={120}
//             className="me-5 border border-primary border-2"
//         />
//         <div className="d-flex flex-column justify-content-start align-self-center mt-2">
//           <p className="fs-4 m-0">{user.username}</p>
//           <p className="fs-5">{user.bio ? user.bio : "(No bio.)"}</p>
//           <p className="fs-6">
//             <small>{user.posts_count} posts</small>
//           </p>
//           {user.id === getUser().id && (
//               <Button
//                   variant="primary"
//                   size="sm"
//                   onClick={() => navigate(`/profile/${user.id}/edit/`)}
//               >
//                 Edit
//               </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

function Test(props) {
    const user = getUser();
    return (
        <div>
            <h1>유저 정보</h1>
            <p>이름: {user.user_id}</p>
            <p>이메일: {user.email}</p>
        </div>

    );
}

function UserProfile() {
    const [profile, setProfile] = useState({});
    useEffect(() => {
        axiosService.get(`${serverUrl}/account/profile/current/`)
            .then(response => {
                const profileData = response.data;
                console.log('API로부터 가져온 데이터:', profileData);
                // API 응답이 비어있지 않은 경우에만 상태 업데이트
                if (response.data) {
                    setProfile(response.data);
                }
            })
            .catch(error => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }, []);

    return (
        <div>
            <h1>프로필 정보</h1>
            <p>닉네임: {profile.nickname || '없음'}</p>
            <p>이미지 URL: {profile.image_url || '없음'}</p>
        </div>
    );
}

// export default ProfileDetails;
export default UserProfile;