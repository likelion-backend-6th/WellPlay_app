import React, { useState, useEffect } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { getUser, useUserActions } from '../hooks/user.actions';
import { Link } from 'react-router-dom';
import LoginFormModal from './authentication/LoginFormModal';
import "./default.css"
import CreateFeed from "./feeds/CreateFeed";
import Home from "../pages/Home"

function Navigationbar() {
  const userActions = useUserActions();
  const user = getUser();
  const handleLogout = () => {
    userActions.logout();
  };
  const handleProfile = async () => {
    try {
      const profileResponse = await userActions.getProfile();
      return profileResponse
    } catch(error) {
      throw error;
    }
  }
  const [profile, setProfile] = useState({})

  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    if (user) {
      handleProfile()
        .then((profileResponse) => {
          setProfile(profileResponse.data);
        })
        .catch((error) => {
          console.error('프로필 정보를 가져오는 중 오류 발생:', error);
        });
    }
  }, []);

  return (
    <Navbar className="content-backgroud" variant="dark" style={{ flexDirection: 'column' }}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar.Brand className="fw-bold" href="/">
              Well Play
            </Navbar.Brand>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <CreateFeed/>
                <Nav.Item as={Link} to={`/profile/${user.user_id}/`}>
                  <Image src={profile.image_url} roundedCircle width={36} height={36} />
                </Nav.Item>
              </div>
            ) : (
              <div>
                {/*로그인 안했을때 Nav바 비워두기*/}
              </div>
            )}
            <LoginFormModal show={showLoginForm} onHide={() => setShowLoginForm(false)} />
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;