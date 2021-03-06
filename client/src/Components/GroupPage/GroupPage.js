import React from 'react';
import { Col, Row, Container, Nav, Button } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import NavBarAfterLogin from '../NavBarAfterLogin';
import LeftSideNavBar from '../LeftSideNavBar';
import MyGroups from '../MyGroups/MyGroups';
import InviteList from '../InviteList/InviteList';

function GroupPage() {
  return (
    <div>
      <NavBarAfterLogin />
      <Container>
        <Row>
          <Col xs={2}>
            <LeftSideNavBar />
          </Col>
          <Col xs={8}>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="./groupPage">My Groups</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="#home" />
              </Nav>
              <Button variant="danger" href="./createGroup">
                Create a group
              </Button>
            </Navbar>
            <Row>
              <Col>Groups List:</Col>
              <Col>
                <p>Invite List:</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <MyGroups />
              </Col>
              <Col>
                <InviteList />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GroupPage;
