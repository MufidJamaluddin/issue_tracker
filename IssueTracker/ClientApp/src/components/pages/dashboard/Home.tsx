import * as React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { ApplicationState } from '../../../store';
import * as AuthStore from '../../../store/AuthStore';

type HomeProps = AuthStore.LoginState & typeof AuthStore.actionCreators;

const Home = (props: HomeProps) => (
    <Container>
        <h1>Welcome, {props.data.name}!</h1>
    </Container>
);

export default connect(
    (state: ApplicationState) => state.authStore,
    AuthStore.actionCreators
)(Home);