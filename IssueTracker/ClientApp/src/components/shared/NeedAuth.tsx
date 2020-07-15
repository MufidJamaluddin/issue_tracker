import * as React from 'react';

import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/AuthStore';

import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'redux';
import { Spinner } from 'reactstrap';

type NeedAuthProps = AuthStore.LoginState
    & typeof AuthStore.actionCreators
    & RouteComponentProps<any>
    & { requireLogin: boolean }

class NeedAuth extends React.PureComponent<NeedAuthProps>
{
    render(): JSX.Element
    {
        return (<>{this.props.children}</>)
    }

    componentDidMount()
    {
        this.loginPolicy()
    }

    componentDidUpdate()
    {
        this.loginPolicy()
    }

    loginPolicy() {
        if (this.props.requireLogin) {
            if (this.props.data.token === null) {
                this.props.history.push('/login')
            }
        }
    }

    UNSAFE_componentWillMount()
    {
        if (this.props.data.token === null)
        {
            this.props.requestUserData()
        }
    }
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.authStore,
        AuthStore.actionCreators
    )
)(NeedAuth)
