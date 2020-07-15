import * as React from 'react'
import { Row, Col, Container, Form, Button, Alert, Spinner } from 'reactstrap'
import CategoryDetailForm from './CategoryDetailForm'
import { connect } from 'react-redux'

import { withRouter } from 'react-router'

import { ApplicationState } from '../../../../store'

import * as CategoryStoreDetail from '../../../../store/CategoryStoreDetail'

import { Link } from 'react-router-dom'
import { compose } from 'redux'

type NewCategoryProps =
    CategoryStoreDetail.OneCategoryState
    & typeof CategoryStoreDetail.actionCreators

class NewCategory extends React.PureComponent<NewCategoryProps>
{
    constructor(props: any)
    {
        super(props)

        this.onSaveSubmit = this.onSaveSubmit.bind(this)
    }

    onSaveSubmit(event: React.FormEvent<HTMLFormElement> | any)
    {
        event.preventDefault();

        let data = new FormData(event.target);

        let itemData: CategoryStoreDetail.CategoryItem = {
            id: null,
            name: data.get('name').toString(),
        }

        this.props.requestInsertOneCategory(itemData)
    }

    componentWillMount(): void
    {
        if (this.props.data.id !== null && this.props.data.id !== '')
        {
            this.props.requestBlankOneCategory()
        }
    }

    render(): JSX.Element
    {
        let data = this.props.data

        let is_successed = this.props.code == 'S'

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
                        {
                            (!is_successed) && 
                            <>
                                <Col md="12">
                                    <h1 className="display-4 text-center">New Category</h1>
                                    <br />
                                </Col>

                                <CategoryDetailForm
                                    md="12"
                                    data={data}
                                    readOnly={false}
                                    readOnlyID={false}
                                    showID={false}
                                />
                            </>
                        }
                        <Col md="12">
                            <Link to="/dashboard/category">
                                <Button type="button" color="light">
                                    <span><i className="fa fa-chevron-left" /></span> &nbsp;
                                    Back
                                </Button>
                            </Link>
                            {
                                (!is_successed) &&
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
)(NewCategory)