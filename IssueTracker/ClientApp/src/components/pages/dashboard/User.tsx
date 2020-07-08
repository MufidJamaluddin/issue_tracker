import * as React from 'react'

import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as UserStore from '../../../store/UserStore'
import { RouteComponentProps, withRouter, generatePath } from 'react-router'
import { Table, Col, Container, PaginationLink, Button, Progress, Row } from 'reactstrap'

type UserProps =
    UserStore.UserState
    & typeof UserStore.actionCreators
    & RouteComponentProps<{ page: string }>;

class User extends React.PureComponent<UserProps>
{
    public constructor(props: any)
    {
        super(props)
        this.changePage = this.changePage.bind(this)
    }

    public componentDidMount()
    {
        const requestedPage = this.props.data.page || 1;
        this.props.requestUser(requestedPage, this.props.data.size);
    }

    private changePage(selectedItem: { selected: number })
    {
        this.props.requestUser(selectedItem.selected + 1, this.props.data.size)
    }

    public render(): JSX.Element {
        return (
            <Container>
                <h1>User</h1>
                {
                    this.renderTableSection()
                }
            </Container>
        );
    }

    public renderTableSection(): JSX.Element
    {
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
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.data.data.map(item => {
                            return (
                                <tr key={item.id}>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
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
    (state: ApplicationState) => state.userStore, // Selects which state properties are merged into the component's props
    UserStore.actionCreators // Selects which action creators are merged into the component's props
)(User as any));