import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input } from 'reactstrap'

import SelectTicketStatuses from './SelectTicketStatuses'

export interface TicketSearchFromDefaultValue
{
    name: string
    status_id: string
    see: number
}

export interface TicketSearchFromProps
{
    searchData: TicketSearchFromDefaultValue
    onSubmit: (e: React.FormEvent<HTMLFormElement> | any) => void
    onClear: (any) => void
}

const TicketSearchForm = (props: TicketSearchFromProps) => <Form onSubmit={props.onSubmit}>
    <Row form>

        <Col md="4">
            <FormGroup row className="thin-padding-right">
                <Label for="ticket_src_name" className="text-left" sm={3}>Name</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="name"
                        id="ticket_src_name"
                        placeholder="Ticket Name"
                        defaultValue={props.searchData.name}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="3">
            <FormGroup row className="thin-padding-right">
                <Label for="ticket_src_status" className="text-left" sm={3}>Status</Label>
                <Col sm={9}>
                    <SelectTicketStatuses
                        name="status_id"
                        id="ticket_src_status"
                        defaultValue={props.searchData.status_id}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="3">
            <FormGroup row className="thin-padding-right">
                <Label for="ticket_src_type" className="text-left" sm={3}>See</Label>
                <Col sm={9}>
                    <Input
                        type="select"
                        name="see"
                        id="ticket_src_status"
                        defaultValue={props.searchData.see}
                    >
                        <option value="0">All Ticket</option>
                        <option value="1">My Own Ticket</option>
                        <option value="2">Assigned To Me</option>
                    </Input>
                </Col>
            </FormGroup>
        </Col>

        <Col md="2">
            <Button type="reset" color="light" onClick={props.onClear}>
                <span><i className="fa fa-times" /></span>
            </Button>
            {' '}
            <Button type="submit" color="light">
                <span><i className="fa fa-search" /></span>
            </Button>
        </Col>

    </Row>
</Form>

export default TicketSearchForm