import * as React from 'react'
import { Row, Col, Container, Form, Button, Alert, Spinner } from 'reactstrap'
import UserDetailForm from './UserDetailForm'
import { connect } from 'react-redux'

import { withRouter } from 'react-router'

import { ApplicationState } from '../../../../store'

import * as UserStoreDetail from '../../../../store/UserStoreDetail'
import { Link } from 'react-router-dom'
import { UserItem } from '../../../../store/UserStore'
import { compose } from 'redux'

type NewUserProps =
    UserStoreDetail.OneUserState
    & typeof UserStoreDetail.actionCreators

class NewUser extends React.PureComponent<NewUserProps>
{
    constructor(props: any) {
        super(props)

        this.onSaveSubmit = this.onSaveSubmit.bind(this)
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any) {
        event.preventDefault();

        let data = new FormData(event.target);

        let itemData: UserItem = {
            id: null,
            name: data.get('name').toString(),
            email: data.get('email').toString(),
            image: null,
            role: data.get('role').toString(),
            password: data.get('password').toString(),
            confirm_password: data.get('confirm_password').toString(),
        }

        this.props.requestInsertOneUser(itemData)
    }

    UNSAFE_componentWillMount(): void {
        if (this.props.data.id !== null || this.props.data.id !== '')
            this.props.requestBlankOneUser()
    }

    renderLoading(): JSX.Element {
        return (
            <Container>
                <Row md="12">
                    {
                        (this.props.code !== null && this.props.code !== '') &&
                        <>
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{this.props.code} :&nbsp;</b>{this.props.message}
                                </Alert>
                            </Col>
                            <Col md="12">
                                <Link to="/dashboard/user">
                                    <Button type="button" color="light">
                                        <span><i className="fa fa-chevron-left" /></span> &nbsp;
                                        Back
                                    </Button>
                                </Link>
                            </Col>
                        </>
                    }
                    <Col md="12">
                        {
                            (this.props.code === null && this.props.code === '') &&
                            <Spinner />
                        }
                    </Col>
                </Row>
            </Container>
        )
    }

    render(): JSX.Element {
        let data = this.props.data

        if (data.id !== null || data.id !== '') {
            return this.renderLoading()
        }

        return (
            <Container>
                <Form onSubmit={this.onSaveSubmit}>
                    <Row form>

                        {
                            (this.props.code !== null && this.props.code !== undefined && this.props.code !== '') &&
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{this.props.code} :&nbsp;</b>{this.props.message}
                                </Alert>
                            </Col>
                        }

                        <Col md="12">
                            <h1 className="display-4 text-center">New User</h1>
                            <br />
                        </Col>

                        <UserDetailForm
                            md="12"
                            data={data}
                            readOnly={false}
                            readOnlyID={false}
                            showID={false}
                        />

                        <Col md="12">
                            <Link to="/dashboard/user">
                                <Button type="button" color="light">
                                    <span><i className="fa fa-chevron-left" /></span> &nbsp;
                                    Back
                                </Button>
                            </Link>
                            <Button type="submit" color="light">
                                <span><i className="fa fa-floppy-o" /></span> &nbsp;
                                Save
                            </Button>
                        </Col>

                    </Row>
                </Form>
            </Container>
        )
    }
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.userStoreDetail,
        UserStoreDetail.actionCreators
    )
)(NewUser)