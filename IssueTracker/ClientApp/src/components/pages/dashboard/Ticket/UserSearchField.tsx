﻿import * as React from 'react'

import * as UserStore from '../../../../store/UserStore'

import { connect } from 'react-redux';
import { Col, FormGroup, Label, Input, Table, Button } from 'reactstrap';
import { UserItem } from '../../../../store/UserStoreDetail';
import PaginationResponseModel from '../../../../store/shared/PaginationResponseModel';
import MessageResponseModel from '../../../../store/shared/MessageResponseModel';

interface UserSearchFieldProps {
    md: number | string,
    readOnly: boolean,
    fieldName: string,
    fieldText: string,
    fieldIDName: string,
    defaultValue: string,
    dataSize: number,
}

interface UserSearchFieldState {
    fetched: boolean
    selected: boolean
}

class UserSearchField extends React.PureComponent<
    UserSearchFieldProps,
    UserStore.UserState & UserSearchFieldState
    >
{
    constructor(props: any) {
        super(props);

        let state1 = UserStore.unloadedState
        let state2 = { fetched: false, selected: false }

        this.state = { ...state1, ...state2 }

        this.onSearch = this.onSearch.bind(this)
        this.onSelectItem = this.onSelectItem.bind(this)
    }

    updateData(): void {
        let searchedData = this.state.searchedData

        if (searchedData.name !== null && searchedData.name !== '' && (!this.state.fetched)) {
            if (searchedData.name.length < 4) return;

            let requestData = {
                searchData: searchedData,
                page: 1,
                size: 5,
                orderBy: 'id',
                orderDirection: 'asc'
            }

            fetch(`api/user/search`, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
                .then(
                    response => response.json() as Promise<PaginationResponseModel<UserItem> & MessageResponseModel>
                )
                .then(data => {
                    this.setState({
                        data: data,
                        searchedData: searchedData,
                        fetched: true,
                        selected: false,
                    })
                })
        }
    }

    componentDidMount(): void {
        this.updateData()
    }

    componentDidUpdate(): void {
        this.updateData()
    }

    onSearch(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();

        let searchedName = event.target.value;

        let searchedData = {
            id: null,
            name: searchedName,
            email: null,
        }

        this.setState(state => {
            return {
                data: state.data,
                searchedData: searchedData,
                fetched: false,
                selected: false,
            }
        })
    }

    onSelectItem(searchedData: UserItem) {
        this.setState(state => {
            return {
                data: state.data,
                searchedData: searchedData,
                fetched: true,
                selected: true,
            }
        })
    }

    renderTable(users: Array<UserItem>): JSX.Element {
        return (
            <>
                <Col sm={3}>
                </Col>
                <Col sm={9}>
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
                                users.map(item => {
                                    return (
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td>{item.name}</td>
                                            <td>
                                                <Button
                                                    type="button"
                                                    color="light"
                                                    onClick={(e: any) => this.onSelectItem(item)}
                                                >
                                                    Select
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </>
        )
    }

    render(): JSX.Element {
        let md = this.props.md
        let readOnly = this.props.readOnly
        let fieldName = this.props.fieldName
        let fieldIDName = this.props.fieldIDName
        let fieldText = this.props.fieldText

        let userName = this.props.defaultValue

        let users = this.state.data.data
        let selected = this.state.selected
        let realReadOnly = readOnly || selected

        if (selected) userName = this.state.searchedData.name
        if (!realReadOnly) fieldText = 'Search ' + fieldText

        let userID = this.state.searchedData.id

        return (
            <>
                <Col md={md}>
                    <FormGroup row className="thin-padding-right">
                        <Label for={'csf_src_' + fieldName} className="text-left" sm={3}>
                            {fieldText}
                        </Label>
                        {
                            (!selected) &&
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name={fieldName}
                                    id={'csf_src_' + fieldName}
                                    placeholder={fieldText}
                                    defaultValue={userName}
                                    readOnly={realReadOnly}
                                    onChange={this.onSearch}
                                />
                            </Col>
                        }
                        {
                            (selected) &&
                            <>
                                <Col sm={2}>
                                    <Input
                                        type="text"
                                        name={fieldIDName}
                                        id={'csf_src_id_' + fieldName}
                                        value={userID}
                                        readOnly={true}
                                        onChange={this.onSearch}
                                    />
                                </Col>
                                <Col sm={5}>
                                    <Input
                                        type="text"
                                        name={fieldName}
                                        id={'csf_src_' + fieldName}
                                        value={userName}
                                        readOnly={true}
                                        onChange={this.onSearch}
                                    />
                                </Col>
                                <Col md="2">
                                    <Button type="button" color="light">
                                        <span><i className="fa fa-times" /></span>
                                    </Button>
                                </Col>
                            </>
                        }
                        {
                            (!realReadOnly) && this.renderTable(users)
                        }
                    </FormGroup>
                </Col>
            </>
        )
    }
}

export default connect()(UserSearchField);