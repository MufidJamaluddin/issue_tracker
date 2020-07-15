import * as React from 'react'
import { Row, Col, Form, Label, FormGroup, Button, Input } from 'reactstrap'

export interface UserSearchFromDefaultValue {
    name: string
    id: string
    email: string
    role?: string
}

export interface UserSearchFromProps {
    searchData: UserSearchFromDefaultValue
    onSubmit: (e: React.FormEvent<HTMLFormElement> | any) => void
    onClear: (any) => void
}

const UserSearchForm = (props: UserSearchFromProps) => <Form onSubmit={props.onSubmit}>
    <Row form>

        <Col md="2">
            <FormGroup row className="thin-padding-right">
                <Label for="user_src_id" className="text-left" sm={3}>ID</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="id"
                        id="user_src_id"
                        placeholder="User ID"
                        defaultValue={props.searchData.id}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="3">
            <FormGroup row className="thin-padding-right">
                <Label for="User_src_name" className="text-left" sm={3}>Name</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="name"
                        id="user_src_name"
                        placeholder="Name"
                        defaultValue={props.searchData.name}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="3">
            <FormGroup row className="thin-padding-right">
                <Label for="user_src_email" className="text-left" sm={3}>Email</Label>
                <Col sm={9}>
                    <Input
                        type="email"
                        name="email"
                        id="user_src_email"
                        placeholder="Email"
                        defaultValue={props.searchData.email}
                    />
                </Col>
            </FormGroup>
        </Col>

        <Col md="2">
            <FormGroup row className="thin-padding-right">
                <Label for="user_src_email" className="text-left" sm={3}>Role</Label>
                <Col sm={9}>
                    <Input
                        type="text"
                        name="role"
                        id="user_src_role"
                        placeholder="Role"
                        defaultValue={props.searchData.role}
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

export default UserSearchForm