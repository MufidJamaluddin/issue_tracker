import * as React from 'react'

import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as TicketStore from '../../../store/TicketStore'

import { withRouter } from 'react-router'
import { Table, Col, Container, PaginationLink, Button, Row, Form, FormGroup, Label, Input } from 'reactstrap'
import SelectTicketStatuses from './Ticket/SelectTicketStatuses'

import { getMonthName } from './../../../monthtexter';

/**
 *  Ticket Component
 **/

type TicketProps =
    TicketStore.TicketState
    & typeof TicketStore.actionCreators;

class Ticket extends React.PureComponent<TicketProps>
{
    public constructor(props: any) {
        super(props);

        this.state = {
            searchData: null
        };

        this.changePage = this.changePage.bind(this)
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
    }

    public componentDidMount()
    {
        const requestedPage = this.props.data.page || 1;
        this.props.searchTicket(requestedPage, this.props.data.size, this.props.searchedData);
    }

    private changePage(selectedItem: { selected: number })
    {
        this.props.searchTicket(selectedItem.selected + 1, this.props.data.size, this.props.searchedData)
    }

    public onSearchSubmit(event)
    {
        event.preventDefault();

        const data = new FormData(event.target);

        const searchedData = {
            name: data.get('name').toString(),
            see: parseInt(data.get('see').toString()),
            status_id: data.get('status_id').toString(),
        };

        const requestedPage = this.props.data.page || 1;
        this.props.searchTicket(requestedPage, this.props.data.size, searchedData);
    }

    public render(): JSX.Element {
        return (
            <Container>
                <h1 className="text-center">Ticket</h1>
                {
                    this.renderSearchForm()
                }
                {
                    this.renderTableSection()
                }
            </Container>
        );
    }

    public renderSearchForm(): JSX.Element {

        let searchedData = this.props.searchedData;

        return (
            <Form onSubmit={this.onSearchSubmit}>
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
                                    defaultValue={searchedData.name}
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
                                    defaultValue={searchedData.status_id}
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
                                    defaultValue={searchedData.see}
                                >
                                    <option value="0">All Ticket</option>
                                    <option value="1">My Own Ticket</option>
                                    <option value="2">Assigned To Me</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="2">
                        <Button type="submit" color="light">
                            <span><i className="fa fa-search" /></span>
                        </Button>
                    </Col>

                </Row>
            </Form>
        )
    }

    public renderTableSection(): JSX.Element {
        return (
            <Row>
                <Col md="12">
                    {
                        this.renderTable()
                    }
                </Col>

                <Col md="12">
                    <ReactPaginate
                        previousLabel={<PaginationLink previous />}
                        nextLabel={<PaginationLink next />}
                        breakLabel={"<span>...</span>"}
                        pageCount={this.props.data.totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.changePage}
                        forcePage={this.props.data.page - 1}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        disabledClassName={"disabled"}
                        activeClassName={"active"} />
                </Col>
            </Row>    
        )
    }

    public renderTable(): JSX.Element {
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Created Date</th>
                        <th>Assignee</th>
                        <th>Owner</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.data.data.map(item => {
                            let date = new Date(item.created_date)
                            return (
                                <tr key={item.id}>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{`${date.getDate()} ${getMonthName(date)} ${date.getFullYear()}`}</td>
                                    <td>{item.assignee}</td>
                                    <td>{item.owner}</td>
                                    <td>{item.category_name}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Button color="light"><span><i className="fa fa-eye" /></span></Button>{' '}
                                        <Button color="light"><span><i className="fa fa-pencil" /></span></Button>{' '}
                                        <Button color="light"><span><i className="fa fa-trash" /></span></Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    }
}

export default withRouter(connect(
    (state: ApplicationState) => state.ticketStore,
    TicketStore.actionCreators
)(Ticket as any));