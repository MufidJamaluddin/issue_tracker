import * as React from 'react'

import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container } from 'reactstrap'
import { UserItem } from '../../../../store/UserStore'
import { RouteComponentProps, withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'

import * as UserStoreDetail from '../../../../store/UserStoreDetail'
import { ApplicationState } from '../../../../store'

export interface UserDetailItemProps
{
    data: UserItem
}

type UserDetailProps =
    UserStoreDetail.OneUserState
    & typeof UserStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & UserDetailItemProps

const UserDetail = (props: UserDetailProps) => {

    const renderLoading = function () {
        if (props.data.id != props.match.params.id) {
            return (
                <Container>
                    <Row md="12">
                        {
                            (props.code != null && props.code != undefined && props.code != '') &&
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{props.code} :&nbsp;</b>{props.message}
                                </Alert>
                            </Col>
                        }
                        <Col md="12">
                            <p className="h3">Load Data...</p>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    const redirectToMenu = function () {
        if (props.data.id != props.match.params.id) {
            props.history.push('/user')
            return (null)
        }
    }

    React.useEffect(() => {
        switch (props.match.params.status) {
            case 'view':
            case 'edit':
                props.requestOneUser(props.match.params.id)
                renderLoading()
                break;

            case 'delete':
                props.requestDeleteOneUser(props.match.params.id)
                redirectToMenu()
                break;
        }
    })

    let user_id = props.match.params.id;
    let is_edit = props.match.params.status == 'edit';
    let is_only_view = !is_edit;

    let title = is_edit ? 'Edit ' : 'View ';

    return (
        <Container>
            <Form>

                <Row form md="6" className="offset-md-3">

                    {
                        (props.code != null && props.code != undefined && props.code != '') &&
                        <Col md="12">
                            <Alert color="warning">
                                <b>{props.code} :&nbsp;</b>{props.message}
                            </Alert>
                        </Col>
                    }

                    <Col md="12">
                        <h1 className="display-4 text-center">{title} User {user_id}</h1>
                        <br/>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="user_src_id" className="text-left" sm={3}>ID</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="id"
                                    id="user_src_id"
                                    value={props.data.id}
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
                                    value={props.data.name}
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
                                    value={props.data.email}
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
                                    value={props.data.role}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {
                        is_edit &&
                        <Col md="8">
                            <Button type="submit" color="light">
                                <span><i className="fa fa-floppy-o" /></span> &nbsp; Save
                            </Button>
                        </Col>
                    }

                </Row>
            </Form >
        </Container>
    )
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.categoryStore,
        UserStoreDetail.actionCreators
    )
)(UserDetail);