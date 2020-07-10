import * as React from 'react'

import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as UserStore from '../../../store/UserStore'
import { withRouter, generatePath } from 'react-router'
import { Table, Col, Container, PaginationLink, Button, Progress, Row } from 'reactstrap'
import { compose } from 'redux'

import UserSearchForm from './User/UserSearchForm'

import ModalImage from 'react-modal-image'

type UserProps =
    UserStore.UserState
    & typeof UserStore.actionCreators

class User extends React.PureComponent<UserProps>
{
    public constructor(props: any)
    {
        super(props)

        this.changePage = this.changePage.bind(this)
        this.onSearchSubmit = this.onSearchSubmit.bind(this)
    }

    public componentDidMount()
    {
        const requestedPage = this.props.data.page || 1;
        this.props.searchUser(requestedPage, this.props.data.size, this.props.searchedData);
    }

    private changePage(selectedItem: { selected: number })
    {
        this.props.searchUser(selectedItem.selected + 1, this.props.data.size, this.props.searchedData)
    }

    public render(): JSX.Element
    {
        return (
            <Container>
                <h1 className="text-center">User</h1>
                <UserSearchForm
                    onSubmit={this.onSearchSubmit}
                    searchData={this.props.searchedData}
                    onClear={this.props.clearSearchUser}
                />
                {
                    this.renderTableSection()
                }
            </Container>
        );
    }

    public onSearchSubmit(event: React.FormEvent<HTMLFormElement> | any)
    {
        event.preventDefault();

        const data = new FormData(event.target);

        const searchedData = {
            id: data.get('id').toString(),
            name: data.get('name').toString(),
            email: data.get('email').toString(),
            role: data.get('role').toString(),
        }

        const requestedPage = this.props.data.page || 1;
        this.props.searchUser(requestedPage, this.props.data.size, searchedData);
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
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.data.data.map(item => {

                            let profileImg = typeof item.image != 'undefined' && item.image ? item.image : '_fox.jpg'
                            let bigProfileImgPath = `${process.env.PUBLIC_URL}/static/profile/${profileImg}`
                            let smallProfileImgPath = `${process.env.PUBLIC_URL}/static/profile_min/${profileImg}`

                            return (
                                <tr key={item.id}>
                                    <th scope="row">{item.id}</th>
                                    <td>
                                        <ModalImage
                                            small={smallProfileImgPath}
                                            large={bigProfileImgPath}
                                            alt={item.name}
                                            hideDownload={true}
                                            hideZoom={true}
                                            className="modal-image rounded"
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
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

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.userStore, // Selects which state properties are merged into the component's props
        UserStore.actionCreators // Selects which action creators are merged into the component's props
    )
)(User as any)