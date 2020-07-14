import * as React from 'react'
import { Col, Label, FormGroup, Input } from 'reactstrap'

import { TicketItem } from '../../../../store/TicketStore'

import SelectTicketStatuses from './SelectTicketStatuses'
import CategorySearchField from './CategorySearchField'
import UserSearchField from './UserSearchField'

export interface TicketDetailFormItemProps {
    data: TicketItem
    readOnly: boolean
    readOnlyID: boolean
    showID: boolean
    md: string | number
}

class TicketDetailForm extends React.PureComponent<TicketDetailFormItemProps>
{
    render(): JSX.Element
    {
        let data = this.props.data

        let readOnly = this.props.readOnly
        let readOnlyID = this.props.readOnlyID
        let showID = this.props.showID
        let md = this.props.md

        let created_date = null

        if (data.created_date)
            created_date = data.created_date.split('T')[0]

        return (
            <>
                {
                    showID &&
                    <Col md={md}>
                        <FormGroup row className="thin-padding-right">
                            <Label for="category_src_id" className="text-left" sm={3}>ID</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="id"
                                    id="category_src_id"
                                    placeholder="Ticket ID"
                                    defaultValue={data.id}
                                    readOnly={readOnlyID}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                }

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="ticket_src_name" className="text-left" sm={3}>Name</Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="name"
                                id="ticket_src_name"
                                placeholder="Name"
                                defaultValue={data.category_name}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <CategorySearchField
                    md={md}
                    readOnly={readOnly}
                    fieldText="Category Name"
                    fieldName="category_name"
                    fieldIDName="category_id"
                    defaultValue={data.category_name}
                    dataSize={5}
                />

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="ticket_src_status" className="text-left" sm={3}>Status</Label>
                        <Col sm={9}>
                            <SelectTicketStatuses
                                name="status_id"
                                id="ticket_src_status"
                                defaultValue={data.status_id}
                                is_only_view={readOnly || (!data.ismyassignedticket)}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="ticket_src_description" className="text-left" sm={3}>Description</Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="description"
                                id="ticket_src_description"
                                placeholder="Ticket Description"
                                defaultValue={data.description}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="ticket_src_created_date" className="text-left" sm={3}>Created Date</Label>
                        <Col sm={9}>
                            <Input
                                type="date"
                                name="created_date"
                                id="ticket_src_created_date"
                                placeholder="Created Date"
                                defaultValue={
                                    created_date
                                }
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <UserSearchField
                    md={md}
                    readOnly={readOnly || (!data.ismyownticket)}
                    fieldText="Assignee"
                    fieldName="assignee"
                    fieldIDName="assignee_id"
                    defaultValue={data.assignee}
                    dataSize={5}
                />

                <UserSearchField
                    md={md}
                    readOnly={readOnly || (!data.ismyownticket)}
                    fieldText="Owner"
                    fieldName="owner"
                    fieldIDName="owner_id"
                    defaultValue={data.owner}
                    dataSize={5}
                />

            </>
        )
    }
}

export default TicketDetailForm