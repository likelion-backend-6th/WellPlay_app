import React from 'react';
import {Container, Image, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {getUser, useUserActions} from '../hooks/user.actions';

import {Link} from 'react-router-dom';

function Navigationbar() {
  const userActions = useUserActions();
  const user = getUser();
  const handleLogout = () => {
    userActions.logout();
  };
  return (
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand className="fw-bold" href="#home">
            Postagram
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <NavDropdown
                  title={<Image src={user.avatar} roundedCircle width={36}
                                height={36}/>}
              >
                <NavDropdown.Item as={Link} to={`/profile/${user.id}/`}>Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default Navigationbar;
