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
    is_only_view?: boolean,
    data: any[],
    defaultValue: any,
} & typeof TicketStatusStore.actionCreators>
{
    componentDidMount(): void {
        this.props.requestTicketStatus();
    }

    render(): JSX.Element {

        let is_only_view = this.props.is_only_view === true

        return (
            <Input
                type="select"
                name={this.props.name}
                id={this.props.id}
                defaultValue={this.props.defaultValue}
                readOnly={is_only_view}
            >
                {
                    (!is_only_view) &&
                    <option key="0" value={''}>All Status</option>
                }
                {
                    this.props.data &&
                    this.props.data.map(item => {

                        let show = true

                        if (is_only_view)
                        {
                            show = this.props.defaultValue == item.id
                        }

                        if (show)
                        {
                            return (<option key={item.id} value={item.id}>{item.name}</option>)
                        }
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