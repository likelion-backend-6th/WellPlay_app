import React, { useState, useEffect } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { getUser, useUserActions } from '../hooks/user.actions';
import { Link } from 'react-router-dom';
import LoginFormModal from './authentication/LoginFormModal'; // LoginFormModal을 import

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

  const [showLoginForm, setShowLoginForm] = useState(false); // 모달 표시 상태 추가

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
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand className="fw-bold" href="/">
          Well Play
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {user ? ( // 사용자가 로그인한 경우에만 아바타표시
              <Nav>
                <Nav.Item as={Link} to={`/profile/${user.user_id}/`}>
                  <Image src={profile.image_url} roundedCircle width={36} height={36} />
                </Nav.Item>
              </Nav>
            ) : (
              <Nav.Item>
                {/*로그인 안했을때 Nav바 비워두기*/}
              </Nav.Item>
            )}
            {/* 로그인 모달 */}
            <LoginFormModal show={showLoginForm} onHide={() => setShowLoginForm(false)} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;