import * as React from 'react'

import { Col, Label, FormGroup, Input } from 'reactstrap'
import { UserItem } from '../../../../store/UserStore'

export interface UserDetailFormProps {
    data: UserItem
    readOnly: boolean
    readOnlyID: boolean
    showID: boolean
    md: string
}

class UserDetailForm extends React.PureComponent<UserDetailFormProps>
{
    render(): JSX.Element
    {
        let data = this.props.data

        let readOnly = this.props.readOnly
        let readOnlyID = this.props.readOnlyID
        let showID = this.props.showID
        let md = this.props.md

        return (
            <>
                {
                    showID &&
                    <Col md={md}>
                        <FormGroup row className="thin-padding-right">
                            <Label for="user_src_id" className="text-left" sm={3}>ID</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="id"
                                    id="user_src_id"
                                    defaultValue={data.id}
                                    readOnly={readOnlyID}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                }

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="User_src_name" className="text-left" sm={3}>Name</Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="name"
                                id="user_src_name"
                                defaultValue={data.name}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="user_src_email" className="text-left" sm={3}>Email</Label>
                        <Col sm={9}>
                            <Input
                                type="email"
                                name="email"
                                id="user_src_email"
                                defaultValue={data.email}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="user_src_role" className="text-left" sm={3}>Role</Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="role"
                                id="user_src_role"
                                defaultValue={data.role}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>

                {
                    (!showID) && (!readOnly) &&
                    <>
                        <Col md={md}>
                            <FormGroup row className="thin-padding-right">
                                <Label for="user_src_password" className="text-left" sm={3}>Password</Label>
                                <Col sm={9}>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="user_src_password"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md={md}>
                            <FormGroup row className="thin-padding-right">
                                <Label for="user_src_cpassword" className="text-left" sm={3}>Confirm Password</Label>
                                <Col sm={9}>
                                    <Input
                                        type="password"
                                        name="confirm_password"
                                        id="user_src_cpassword"
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </>
                }
            </>
        )
    }
}

export default UserDetailForm