import * as React from 'react';

import * as LoadingStore from './../../store/LoadingStore';
import { ApplicationState } from '../../store';
import { connect } from 'react-redux';
import { Progress } from 'reactstrap';

interface LoadingProps { isLoading: boolean }

class LoadingComponent extends React.PureComponent<LoadingProps>
{
    render() {
        return (<Progress
            animated={this.props.isLoading}
            color='primary'
            value='100'
            className="progress-thin" />)
    }
}

export default connect(
    (state: ApplicationState) => state.loadingStore,
    LoadingStore.actionCreators
)(LoadingComponent as any)