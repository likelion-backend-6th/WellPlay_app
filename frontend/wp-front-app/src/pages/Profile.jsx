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
  const user = useSWR(`/acouunt/profile/${profileId}/`, fetcher);


  return (
      <Layout hasNavigationBack>
        <Row className="justify-content-evenly">
          <Col sm={9}>
            <ProfileDetails user={user.data}/>
            <div>
            </div>
          </Col>
        </Row>
      </Layout>
  );
}

export default Profile;
