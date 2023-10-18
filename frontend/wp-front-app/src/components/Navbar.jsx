import React, {useState, useEffect} from 'react';
import {Container, Image, Nav, Navbar, NavDropdown, Button} from 'react-bootstrap';
import {getUser, useUserActions} from '../hooks/user.actions';
import {Link} from 'react-router-dom';
import LoginFormModal from './authentication/LoginFormModal';
import "./default.css"
import "../App.css"
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
        } catch (error) {
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
        <Navbar className="content-backgroud" variant="dark" style={{flexDirection: 'column'}}>
            <Container>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Navbar.Brand className="fw-bold" href="/">
                            <img src="/media/nav/logo.png" alt="logo" width={130} height={130} className="logo"/>
                        </Navbar.Brand>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        <Button className="home-button" href="/">
                            <img src="/media/nav/home.png" alt="홈"/>홈
                        </Button>
                    </div>
                    {user ? (
                        <div style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
                            <CreateFeed refresh={Home.fetchFeeds}/>
                        </div>
                    ) : (
                        <div>
                            {/*로그인 안했을때 Nav바 비워두기*/}
                        </div>
                    )}
                    <div style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        {user ? (
                            <Button as={Link} to={`/profile/${user.user_id}/`} className="profile-button">
                                <img src={profile.image_url} width={36} height={36}/> 프로필
                            </Button>
                        ) : (
                            <div>
                                {/*로그인 안했을때 Nav바 비워두기*/}
                            </div>
                        )}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        <LoginFormModal show={showLoginForm} onHide={() => setShowLoginForm(false)}/>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
}

export default Navigationbar;