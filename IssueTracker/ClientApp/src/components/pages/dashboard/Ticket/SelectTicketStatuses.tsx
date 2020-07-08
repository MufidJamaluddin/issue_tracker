import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../../store'
import * as TicketStatusStore from '../../../../store/TicketStatusStore'
import { Input } from 'reactstrap';

/**
 * Ticket Status Component
 * @param props
 */
class SelectTicketStatuses extends React.PureComponent<{
    name: string,
    id: string,
    data: any[],
    defaultValue: any,
} & typeof TicketStatusStore.actionCreators>
{
    componentDidMount(): void {
        this.props.requestTicketStatus();
    }

    render(): JSX.Element {
        return (
            <Input
                type="select"
                name={this.props.name}
                id={this.props.id}
                defaultValue={this.props.defaultValue}
            >
                <option value={null}>All Status</option>
                {
                    this.props.data &&
                    this.props.data.map(item => {
                        return (<option key={item.id} value={item.id}>{item.name}</option>)
                    })
                }
            </Input>
        )
    }
}

const SelectTicketStatusesComponent = connect(
    (state: ApplicationState) => state.ticketStatusStore,
    TicketStatusStore.actionCreators
)(SelectTicketStatuses);

export default SelectTicketStatusesComponent