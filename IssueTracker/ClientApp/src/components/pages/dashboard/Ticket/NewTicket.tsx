import * as React from 'react'
import { Row, Col, Container, Form, Button, Alert, Spinner } from 'reactstrap'
import TicketDetailForm from './TicketDetailForm'
import { connect } from 'react-redux'

import { withRouter } from 'react-router'

import { ApplicationState } from '../../../../store'

import * as TicketStoreDetail from '../../../../store/TicketStoreDetail'
import { Link } from 'react-router-dom'
import { TicketItem } from '../../../../store/TicketStore'
import { compose } from 'redux'

type NewTicketProps =
    TicketStoreDetail.OneTicketState
    & typeof TicketStoreDetail.actionCreators

class NewTicket extends React.PureComponent<NewTicketProps>
{
    constructor(props: any) {
        super(props)

        this.onSaveSubmit = this.onSaveSubmit.bind(this)
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any) {
        event.preventDefault();

        let data = new FormData(event.target);

        const ToString = (val: FormDataEntryValue): string => {
            if (val) return val.toString()
            else return null
        }

        let itemData: TicketItem = {
            id: null,
            name: ToString(data.get('name')),
            description: ToString(data.get('description')),
            created_date: ToString(data.get('created_date')),
            category_id: ToString(data.get('category_id')),
            category_name: ToString(data.get('category_name')),
            assignee_id: ToString(data.get('assignee_id')),
            assignee: ToString(data.get('assignee')),
            owner_id: ToString(data.get('owner_id')),
            owner: ToString(data.get('owner')),
            status: ToString(data.get('status')),
            status_id: ToString(data.get('status_id')),
        }

        this.props.requestInsertOneTicket(itemData)
    }

    componentWillMount(): void
    {
        if (this.props.data.id !== null && this.props.data.id !== '')
        {
            this.props.requestBlankOneTicket()
        }
    }

    render(): JSX.Element
    {
        let data = this.props.data

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
                            <h1 className="display-4 text-center">New Ticket</h1>
                            <br />
                        </Col>

                        <TicketDetailForm
                            md="12"
                            data={data}
                            readOnly={false}
                            readOnlyID={false}
                            showID={false}
                        />

                        <Col md="12">
                            <Link to="/dashboard/ticket">
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
        (state: ApplicationState) => state.ticketStoreDetail,
        TicketStoreDetail.actionCreators
    )
)(NewTicket)