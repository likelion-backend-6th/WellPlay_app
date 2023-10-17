import React from 'react';
import Layout from '../components/Layout';
import {Col, Row} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {fetcher} from '../helpers/axios';
import useSWR from 'swr';
import ProfileDetails from '../components/profile/ProfileDetails';
import UserProfileDetails from '../components/profile/UserProfileDetails';
import {getUser} from "../hooks/user.actions";

function Profile() {
    const {profileId} = useParams();
    const user = useSWR(`/account/profile/${profileId}/`, fetcher);
    const username = getUser();


    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                <Col sm={9}>
                {user ? (
                    <>
                        {username && username.user_id ? (
                            profileId === username.user_id ? (
                                // 로그인한 사용자의 프로필 정보를 표시
                                <ProfileDetails user={user} />
                            ) : (
                                // 다른 유저의 프로필 정보를 표시
                                <UserProfileDetails user={user} />
                            )
                        ) : (
                            <UserProfileDetails />
                        )}
                        {/* 다른 프로필 정보 표시 */}
                    </>
                ) : (
                    <div>Loading...</div>
                )}
                </Col>
            </Row>
        </Layout>
    );
}

export default Profile;
