import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { ApplicationState } from '../../../store';
import * as AuthStore from '../../../store/AuthStore';
import { compose } from 'redux';

type LogoutProps = AuthStore.LoginState & typeof AuthStore.actionCreators & RouteComponentProps<any>

class Logout extends React.Component<LogoutProps>
{
    private redirectToHome(): void
    {
        this.props.history.push(`/`)
    }

    public render(): JSX.Element
    {
        return (null);
    }

    public loginPolicy(): void
    {
        if (this.props.data.id === null || this.props.data.id === undefined)
        {
            this.redirectToHome()
        }
        else
        {
            this.props.requestLogout()
        }
    }

    public componentDidMount(): void
    {
        this.loginPolicy()
    }

    public componentDidUpdate(): void
    {
        this.loginPolicy()
    }

}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.authStore,
        AuthStore.actionCreators
    )
)(Logout)