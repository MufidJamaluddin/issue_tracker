import * as React from 'react';

import { connect } from 'react-redux';

import { ApplicationState } from '../../store';
import * as AuthStore from '../../store/AuthStore';

import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'redux';

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

    UNSAFE_componentWillMount()
    {
        if (!this.props.requireLogin)
        {
            if (this.props.data.token === null)
            {
                this.props.history.push('/login')
            }
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
