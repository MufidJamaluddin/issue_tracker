import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container } from 'reactstrap'

import { TicketItem } from '../../../../store/TicketStore'

import SelectTicketStatuses from './SelectTicketStatuses'

import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ApplicationState } from '../../../../store'

import * as TicketStoreDetail from '../../../../store/TicketStoreDetail'

export interface TicketDetailItemProps
{
    data: TicketItem
}

type TicketDetailProps =
    TicketStoreDetail.OneTicketState
    & typeof TicketStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & TicketDetailItemProps

const TicketDetail = (props: TicketDetailProps) => {

    const renderLoading = function () {
        if (props.data.id != props.match.params.id) {
            return (
                <Container>
                    <Row md="12">
                        {
                            (props.code != null && props.code != '') &&
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
            props.history.push('/ticket')
            return (null)
        }
    }

    React.useEffect(() => {
        switch (props.match.params.status) {
            case 'view':
            case 'edit':
                props.requestOneTicket(props.match.params.id)
                renderLoading()
                break;

            case 'delete':
                props.requestDeleteOneTicket(props.match.params.id)
                redirectToMenu()
                break;
        }
    })

    let ticket_id = props.match.params.id;
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
                        <h1 className="display-4 text-center">{title} Ticket {ticket_id}</h1>
                        <br/>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_name" className="text-left" sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="ticket_src_name"
                                    placeholder="Ticket Name"
                                    value={props.data.name}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_category_name" className="text-left" sm={3}>Ticket Name</Label>
                            <Col sm={9}>
                                <Input
                                    type="date"
                                    name="name"
                                    id="ticket_src_category_name"
                                    placeholder="Category Name"
                                    value={props.data.category_name}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_status" className="text-left" sm={3}>Status</Label>
                            <Col sm={9}>
                                <SelectTicketStatuses
                                    name="status_id"
                                    id="ticket_src_status"
                                    defaultValue={props.data.status_id}
                                    is_only_view={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_description" className="text-left" sm={3}>Description</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="ticket_src_description"
                                    placeholder="Ticket Description"
                                    value={props.data.description}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_created_date" className="text-left" sm={3}>Created Date</Label>
                            <Col sm={9}>
                                <Input
                                    type="date"
                                    name="name"
                                    id="ticket_src_created_date"
                                    placeholder="Created Date"
                                    value={props.data.created_date}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_assignee" className="text-left" sm={3}>Assignee</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="ticket_src_assignee"
                                    placeholder="Assignee"
                                    value={props.data.assignee}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="8">
                        <FormGroup row className="thin-padding-right">
                            <Label for="ticket_src_owner" className="text-left" sm={3}>Owner</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="ticket_src_assignee"
                                    placeholder="Assignee"
                                    value={props.data.owner}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {
                        is_edit &&
                        <Col md="8">
                            <Button type="submit" color="light">
                                <span><i className="fa fa-floppy-o" /></span>
                                &nbsp; Save
                            </Button>
                        </Col>
                    }

                </Row>
            </Form>
        </Container>
    )
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.categoryStore,
        TicketStoreDetail.actionCreators
    )
)(TicketDetail);