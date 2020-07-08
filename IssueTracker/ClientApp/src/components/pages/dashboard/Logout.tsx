import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

class Logout extends React.PureComponent<RouteComponentProps<any>> {

    redirectToHome = () => {
        this.props.history.push(`/`)
    }

    render(): JSX.Element
    {
        return (null);
    }

    componentDidMount()
    {
        this.redirectToHome()
    }

}

export default withRouter(connect()(Logout));