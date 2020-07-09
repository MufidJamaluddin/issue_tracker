import * as React from 'react';
import { Container, Form, Button, Col, FormGroup, Input, Label, Alert } from 'reactstrap';

import { ApplicationState } from '../../../store';
import * as AuthStore from '../../../store/AuthStore';

import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import './Login.css';
import { compose } from 'redux';

type LoginProps = AuthStore.LoginState & typeof AuthStore.actionCreators & RouteComponentProps<any>

class Login extends React.PureComponent<LoginProps>
{
    constructor(props: any)
    {
        super(props)

        this.onLoginSubmit = this.onLoginSubmit.bind(this)
    }

    public onLoginSubmit(event): void
    {
        event.preventDefault();

        const data = new FormData(event.target);

        const loginData = {
            email: data.get('email').toString(),
            password: data.get('password').toString(),
        };

        this.props.requestLogin(loginData.email, loginData.password)
    }

    public componentDidMount()
    {
        if (this.props.data.token !== null)
        {
            this.props.history.push('/dashboard')
        }
    }

    public componentDidUpdate()
    {
        if (this.props.data.token !== null)
        {
            this.props.history.push('/dashboard')
        }
    }

    private renderMessage(): JSX.Element
    {
        if (this.props.status) return null;

        return (
            <Alert color="danger">
                <b>{this.props.code} :&nbsp;</b>{this.props.message}
            </Alert>
        )
    }

    public render(): JSX.Element
    {
        return (
            <div className="wrapper vh-center">
                <div className="wrapper-inner text-center">
                    {
                        this.renderMessage()
                    }
                    <h2 className="title">Login</h2>
                    <Form className="form" onSubmit={this.onLoginSubmit}>
                        <FormGroup row>
                            <Col sm="2" className="text-left">
                                <span><i className="fa fa-user" /></span>
                            </Col>
                            <Col sm="10">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm="2" className="text-left">
                                <span><i className="fa fa-key" /></span>
                            </Col>
                            <Col sm="10">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    />
                            </Col>
                        </FormGroup>
                        <Button type="submit" className="text-center">Login</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.authStore,
        AuthStore.actionCreators
    )
)(Login as any)
