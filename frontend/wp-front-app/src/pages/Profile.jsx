import React from 'react';
import Layout from '../components/Layout';
import {Col, Row} from 'react-bootstrap';
import Post from '../components/feeds/Feed';
import {useParams} from 'react-router-dom';
import {fetcher} from '../helpers/axios';
import useSWR from 'swr';
import ProfileDetails from '../components/profile/ProfileDetails';

function Profile() {
  const {profileId} = useParams();
  const user = useSWR(`/account/profile/${profileId}/`, fetcher);


  return (
       <Layout hasNavigationBack>
      <Row className="justify-content-evenly">
        <Col sm={9}>
          {user ? (
            <>
              {profileId === 'myprofile' ? (
                // 로그인한 사용자의 프로필 정보를 표시
                <ProfileDetails user={user} />
              ) : (
                // 다른 유저의 프로필 정보를 표시
                <ProfileDetails user={user} />
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
