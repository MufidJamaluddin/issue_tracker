import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container, Spinner } from 'reactstrap'

import { TicketItem } from '../../../../store/TicketStore'

import SelectTicketStatuses from './SelectTicketStatuses'

import { RouteComponentProps, withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ApplicationState } from '../../../../store'

import * as TicketStoreDetail from '../../../../store/TicketStoreDetail'
import { Link } from 'react-router-dom'
import TicketDetailForm from './TicketDetailForm'

export interface TicketDetailItemProps
{
    data: TicketItem
}

type TicketDetailProps =
    TicketStoreDetail.OneTicketState
    & typeof TicketStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & TicketDetailItemProps


class TicketDetail extends React.PureComponent<TicketDetailProps>
{
    constructor(props: any)
    {
        super(props)

        this.onSaveSubmit = this.onSaveSubmit.bind(this)
    }

    renderLoading(): JSX.Element
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
                                <Link to="/dashboard/ticket">
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
                            (this.props.code === null || this.props.code === '') &&
                            <Spinner />
                        }
                    </Col>
                </Row>
            </Container>

        )
    }

    redirectToMenu() : void
    {
        this.props.history.push('/dashboard/ticket')
    }

    componentDidMount(): void
    {
        switch (this.props.match.params.status)
        {
            case 'view':
            case 'edit':
                this.props.requestOneTicket(this.props.match.params.id)
                break;

            case 'delete':
                this.props.requestDeleteOneTicket(this.props.match.params.id)
                break;
        }
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any)
    {
        event.preventDefault();

        let data = new FormData(event.target);

        let itemData: TicketItem = {
            id: this.props.data.id,
            name: data.get('name').toString(),
            category_name: data.get('category_name').toString(),
            status_id: data.get('status_id').toString(),
            status: null, // AUTO
            description: data.get('description').toString(),
            created_date: data.get('created_date').toString(),
            assignee: data.get('assignee').toString(),
            owner: data.get('owner').toString(),
        }

        this.props.requestUpdateOneTicket(this.props.data.id, itemData)
    }

    render()
    {
        if (this.props.data.id != this.props.match.params.id)
        {
            return this.renderLoading();
        }

        let ticket_id = this.props.match.params.id;
        let is_edit = this.props.match.params.status == 'edit';

        let readOnly = !is_edit

        let title = is_edit ? 'Edit ' : 'View ';

        let data: TicketItem = this.props.data

        return (
            <Container>
                <Form onSubmit={this.onSaveSubmit}>

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
                            <h1 className="display-4 text-center">{title} Ticket {ticket_id}</h1>
                            <br />
                        </Col>

                        <TicketDetailForm
                            md="12"
                            data={data}
                            readOnly={readOnly}
                            readOnlyID={true}
                            showID={true}
                        />

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
                                    <span><i className="fa fa-floppy-o" /></span>
                                    &nbsp; Save
                                </Button>
                            }
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
        (state: ApplicationState) => state.ticketStoreDetail,
        TicketStoreDetail.actionCreators
    )
)(TicketDetail);