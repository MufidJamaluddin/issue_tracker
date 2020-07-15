import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input } from 'reactstrap'

export interface CategorySearchFromDefaultValue {
    name: string
    id: string
}

export interface CategorySearchFromProps {
    searchData: CategorySearchFromDefaultValue
    onSubmit: (e: React.FormEvent<HTMLFormElement> | any) => void
    onClear: (any) => void
}

const CategorySearchForm = (props: CategorySearchFromProps) => <Form onSubmit={props.onSubmit}>
    <Row form>

        <Col md="2">
            <FormGroup row className="thin-padding-right">
                <Label for="category_src_id" className="text-left" sm={3}>ID</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="id"
                        id="category_src_id"
                        placeholder="Category ID"
                        defaultValue={props.searchData.id}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="4">
            <FormGroup row className="thin-padding-right">
                <Label for="Category_src_name" className="text-left" sm={3}>Name</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="name"
                        id="Category_src_name"
                        placeholder="Category Name"
                        defaultValue={props.searchData.name}
                    />
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

export default CategorySearchForm