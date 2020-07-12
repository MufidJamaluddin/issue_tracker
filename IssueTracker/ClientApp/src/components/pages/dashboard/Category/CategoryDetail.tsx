import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input, Alert, Container } from 'reactstrap'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { CategoryItem } from '../../../../store/CategoryStore'
import { ApplicationState } from '../../../../store'

import * as CategoryStoreDetail from '../../../../store/CategoryStoreDetail'

interface CategoryDetailItemProps {
    data: CategoryItem
}

type CategoryDetailProps =
    CategoryStoreDetail.OneCategoryState
    & typeof CategoryStoreDetail.actionCreators
    & RouteComponentProps<{ id: string, status?: string }>
    & CategoryDetailItemProps

const CategoryDetail = (props: CategoryDetailProps) => {

    const renderLoading = function () {
        if (props.data.id != props.match.params.id) {
            return (
                <Container>
                    <Row md="12">
                        {
                            (props.code != null && props.code != '') &&
                            <Col md="12">
                                <Alert color="warning">
                                    <b>{props.code} :&nbsp;</b>{props.message}
                                </Alert>
                            </Col>
                        }
                        <Col md="12">
                            <p className="h3">Load Data...</p>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    const redirectToMenu = function () {
        if (props.data.id != props.match.params.id) {
            props.history.push('/category')
            return (null)
        }
    }

    React.useEffect(() => {
        switch (props.match.params.status) {
            case 'view':
            case 'edit':
                props.requestOneCategory(props.match.params.id)
                renderLoading()
                break;

            case 'delete':
                props.requestDeleteOneCategory(props.match.params.id)
                redirectToMenu()
                break;
        }
    })

    let category_id = props.match.params.id;
    let is_edit = props.match.params.status == 'edit';
    let is_only_view = !is_edit;

    let title = is_edit ? 'Edit ' : 'View ';

    return (
        <Container>
            <Form>
                <Row form md="6" className="offset-md-3">

                    {
                        (props.code !== null && props.code !== undefined && props.code !== '') &&
                        <Col md="12">
                            <Alert color="warning">
                                <b>{props.code} :&nbsp;</b>{props.message}
                            </Alert>
                        </Col>
                    }

                    <br/>

                    <Col md="12">
                        <h1 className="display-4 text-center">{title} Category {category_id}</h1>
                        <br/>
                    </Col>

                    <Col md="12">
                        <FormGroup row className="thin-padding-right">
                            <Label for="category_src_id" className="text-left" sm={3}>ID</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="id"
                                    id="category_src_id"
                                    placeholder="Category ID"
                                    value={props.data.id}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col md="12">
                        <FormGroup row className="thin-padding-right">
                            <Label for="Category_src_name" className="text-left" sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="name"
                                    id="Category_src_name"
                                    placeholder="Category Name"
                                    value={props.data.name}
                                    readOnly={is_only_view}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {
                        is_edit &&
                        <Col md="12">
                            <Button type="submit" color="light">
                                <span><i className="fa fa-floppy-o" /></span> &nbsp;
                                Save
                            </Button>
                        </Col>
                    }

                </Row>
            </Form>
        </Container>
    )
}

export default compose(
    withRouter,
    connect(
        (state: ApplicationState) => state.categoryStore,
        CategoryStoreDetail.actionCreators
    )
)(CategoryDetail);