import * as React from 'react'
import { Col, Label, FormGroup, Input } from 'reactstrap'
import { CategoryItem } from '../../../../store/CategoryStoreDetail'

interface CategoryDetailFormItemProps {
    data: CategoryItem
    readOnly: boolean
    readOnlyID: boolean
    showID: boolean
    md: string | number
}

class CategoryDetailForm extends React.PureComponent<CategoryDetailFormItemProps>
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
                            <Label for="category_src_id" className="text-left" sm={3}>ID</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="id"
                                    id="category_src_id"
                                    placeholder="Category ID"
                                    defaultValue={data.id}
                                    readOnly={readOnlyID}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                }

                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for="Category_src_name" className="text-left" sm={3}>Name</Label>
                        <Col sm={9}>
                            <Input
                                type="text"
                                name="name"
                                id="Category_src_name"
                                placeholder="Category Name"
                                defaultValue={data.name}
                                readOnly={readOnly}
                            />
                        </Col>
                    </FormGroup>
                </Col>
            </>
        )
    }
}

export default CategoryDetailForm;