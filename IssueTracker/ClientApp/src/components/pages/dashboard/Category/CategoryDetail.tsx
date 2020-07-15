import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container, Spinner } from 'reactstrap'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { CategoryItem } from '../../../../store/CategoryStore'
import { ApplicationState } from '../../../../store'

import * as CategoryStoreDetail from '../../../../store/CategoryStoreDetail'
import { Link } from 'react-router-dom'

import CategoryForm from './CategoryDetailForm'

interface CategoryDetailItemProps {
    data: CategoryItem
}

type CategoryDetailProps =
    CategoryStoreDetail.OneCategoryState
    & typeof CategoryStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & CategoryDetailItemProps

class CategoryDetail extends React.PureComponent<CategoryDetailProps>
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
                                <Link to="/dashboard/category">
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

    redirectToMenu()
    {
        this.props.history.push('/dashboard/category')
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any)
    {
        event.preventDefault();

        let data = new FormData(event.target);

        let itemData = {
            id: data.get('id').toString(),
            name: data.get('name').toString(),
        }

        this.props.requestUpdateOneCategory(itemData.id, itemData)
    }

    componentDidMount(): void
    {
        switch (this.props.match.params.status)
        {
            case 'view':
            case 'edit':
                this.props.requestOneCategory(this.props.match.params.id)
                break;

            case 'delete':
                this.props.requestDeleteOneCategory(this.props.match.params.id)
                break;
        }
    }

    render(): JSX.Element
    {
        if (this.props.data.id != this.props.match.params.id)
        {
            return this.renderLoading();
        }

        let category_id = this.props.match.params.id;
        let is_edit = this.props.match.params.status == 'edit';
        let is_only_view = !is_edit;

        let title = is_edit ? 'Edit ' : 'View ';

        let data = this.props.data

        return (
            <Container>
                <Form onSubmit={this.onSaveSubmit}>
                    <Row form md="6" className="offset-md-3">

                        {
                            (this.props.code !== null && this.props.code !== undefined && this.props.code !== '') &&
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{this.props.code} :&nbsp;</b>{this.props.message}
                                </Alert>
                            </Col>
                        }

                        <br />

                        <Col md="12">
                            <h1 className="display-4 text-center">{title} Category {category_id}</h1>
                            <br />
                        </Col>

                        <CategoryForm
                            md="12"
                            data={data}
                            readOnly={is_only_view}
                            readOnlyID={true}
                            showID={true}
                        />

                        <Col md="12">
                            <Link to="/dashboard/category">
                                <Button type="button" color="light">
                                    <span><i className="fa fa-chevron-left" /></span> &nbsp;
                                    Back
                                </Button>
                            </Link>
                            {
                                is_edit &&
                                <Button type="submit" color="light">
                                    <span><i className="fa fa-floppy-o" /></span> &nbsp;
                                    Save
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
        (state: ApplicationState) => state.categoryStoreDetail,
        CategoryStoreDetail.actionCreators
    )
)(CategoryDetail);