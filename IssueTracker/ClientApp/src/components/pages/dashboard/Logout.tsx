import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

import { ApplicationState } from '../../../store';
import * as AuthStore from '../../../store/AuthStore';
import { compose } from 'redux';

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

    public componentDidUpdate(): void
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

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.authStore,
        AuthStore.actionCreators
    )
)(Logout as any)