import * as React from 'react';
import { Container, Form, Button, Col, FormGroup, Input, Label } from 'reactstrap';

import './Login.css';
import { Link } from 'react-router-dom';

class Login extends React.PureComponent {
    render(): JSX.Element {
        return (
            <div className="wrapper vh-center">
                <div className="wrapper-inner">
                    <h2 className="title">Login</h2>
                    <Form className="form">
                        <Col>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="myemail@email.com"
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="********"
                                />
                            </FormGroup>
                        </Col>
                        <Link to="/dashboard">
                            <Button type="button">Submit</Button>
                        </Link>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;