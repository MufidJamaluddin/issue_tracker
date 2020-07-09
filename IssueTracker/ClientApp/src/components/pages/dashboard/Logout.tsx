import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { ApplicationState } from '../../../store';
import * as AuthStore from '../../../store/AuthStore';

type LogoutProps = AuthStore.LoginState & typeof AuthStore.actionCreators & RouteComponentProps<any>

class Logout extends React.PureComponent<LogoutProps>
{
    private redirectToHome(): void
    {
        this.props.history.push(`/`)
    }

    public render(): JSX.Element
    {
        return (null);
    }

    public componentDidMount(): void
    {
        if (this.props.data.token === null)
        {
            this.redirectToHome()
        }
        else
        {
            this.props.requestLogout()
        }
    }

}

export default withRouter(connect(
    (state: ApplicationState) => state.authStore,
    AuthStore.actionCreators
)(Logout as any))