import * as React from 'react'

import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container, Spinner } from 'reactstrap'
import { UserItem } from '../../../../store/UserStore'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as UserStoreDetail from '../../../../store/UserStoreDetail'
import { ApplicationState } from '../../../../store'
import { Link } from 'react-router-dom'

export interface UserDetailItemProps
{
    data: UserItem
}

type UserDetailProps =
    UserStoreDetail.OneUserState
    & typeof UserStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & UserDetailItemProps


class UserDetail extends React.PureComponent<UserDetailProps>
{
    constructor(props: any)
    {
        super(props)

        this.onSaveSubmit = this.onSaveSubmit.bind(this)
    }

    renderLoading()
    {
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

    redirectToMenu(): void
    {
        this.props.history.push('/dashboard/user')
    }

    componentDidMount()
    {
        switch (this.props.match.params.status)
        {
            case 'view':
            case 'edit':
                this.props.requestOneUser(this.props.match.params.id)
                break;

            case 'delete':
                this.props.requestDeleteOneUser(this.props.match.params.id)
                break;
        }
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any) {
        event.preventDefault();

        let data = new FormData(event.target);

        let itemData: UserItem = {
            id: this.props.data.id,
            name: data.get('name').toString(),
            email: data.get('email').toString(),
            role: data.get('role').toString(),
        }

        this.props.requestUpdateOneUser(this.props.data.id, itemData)
    }

    render()
    {
        let user_id = this.props.match.params.id;
        let is_edit = this.props.match.params.status == 'edit';
        let is_only_view = !is_edit;

        let title = is_edit ? 'Edit ' : 'View ';

        let data = this.props.data

        return (
            <Container>
                <Form>

                    <Row form md="6" className="offset-md-3">

                        {
                            (this.props.code != null && this.props.code != undefined && this.props.code != '') &&
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{this.props.code} :&nbsp;</b>{this.props.message}
                                </Alert>
                            </Col>
                        }

                        <Col md="12">
                            <h1 className="display-4 text-center">{title} User {user_id}</h1>
                            <br />
                        </Col>

                        <Col md="8">
                            <FormGroup row className="thin-padding-right">
                                <Label for="user_src_id" className="text-left" sm={3}>ID</Label>
                                <Col sm={9}>
                                    <Input
                                        type="text"
                                        name="id"
                                        id="user_src_id"
                                        defaultValue={data.id}
                                        readOnly={is_only_view}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="8">
                            <FormGroup row className="thin-padding-right">
                                <Label for="User_src_name" className="text-left" sm={3}>Name</Label>
                                <Col sm={9}>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="user_src_name"
                                        defaultValue={data.name}
                                        readOnly={is_only_view}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="8">
                            <FormGroup row className="thin-padding-right">
                                <Label for="user_src_email" className="text-left" sm={3}>Email</Label>
                                <Col sm={9}>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="user_src_email"
                                        defaultValue={data.email}
                                        readOnly={is_only_view}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="8">
                            <FormGroup row className="thin-padding-right">
                                <Label for="user_src_email" className="text-left" sm={3}>Role</Label>
                                <Col sm={9}>
                                    <Input
                                        type="text"
                                        name="role"
                                        id="user_src_role"
                                        defaultValue={data.role}
                                        readOnly={is_only_view}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="8">
                            <Link to="/dashboard/ticket">
                                <Button type="button" color="light">
                                    <span><i className="fa fa-chevron-left" /></span> &nbsp;
                                    Back
                                </Button>
                            </Link>
                            {
                                is_edit &&
                                <Button type="submit" color="light">
                                    <span><i className="fa fa-floppy-o" /></span> &nbsp; Save
                                </Button>
                            }
                        </Col>

                    </Row>
                </Form >
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
)(UserDetail);