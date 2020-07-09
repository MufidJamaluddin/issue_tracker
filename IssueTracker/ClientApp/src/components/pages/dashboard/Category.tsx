import * as React from 'react'

import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as CategoryStore from '../../../store/CategoryStore'
import { RouteComponentProps, withRouter, generatePath } from 'react-router'
import { Table, Col, Container, PaginationLink, Button, Progress, Row } from 'reactstrap'

type CategoryProps =
    CategoryStore.CategoryState
    & typeof CategoryStore.actionCreators;

class Category extends React.PureComponent<CategoryProps>
{
    public constructor(props: any)
    {
        super(props);

        this.changePage = this.changePage.bind(this)
    }
    
    public componentDidMount()
    {
        const requestedPage = this.props.data.page || 1;
        this.props.searchCategory(requestedPage, this.props.data.size, {
            id: '', name: ''
        });
    }
    
    private changePage(selectedItem: { selected: number })
    {
        this.props.searchCategory(selectedItem.selected + 1, this.props.data.size, {
            id: '', name: ''
        })
    }

    public render(): JSX.Element
    {
        return (
            <Container>
                <h1 className="text-center">Category</h1>
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

    public renderTable(): JSX.Element
    {
        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
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
    (state: ApplicationState) => state.categoryStore, // Selects which state properties are merged into the component's props
    CategoryStore.actionCreators // Selects which action creators are merged into the component's props
)(Category as any));