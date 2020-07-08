import * as React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

const Home = () => (
    <Container>
        <h1>Welcome, Mufid!</h1>
    </Container>
);

export default connect()(Home);