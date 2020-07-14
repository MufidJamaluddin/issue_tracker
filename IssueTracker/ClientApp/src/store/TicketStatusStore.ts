import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

export interface TicketStatusState {
    data?: TicketStatusItem[]
}

export interface TicketStatusItem {
    id: string
    name: string
    color: string
}


interface ReceiveTicketStatusAction {
    type: 'RECEIVE_TICKETSTATUS'
    data: TicketStatusItem[]
}

type KnownAction = ReceiveTicketStatusAction | StartLoadingAction | EndLoadingAction;

export const actionCreators = {
    requestTicketStatus: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStatusStore &&
                appState.ticketStatusStore.data === null
            ) {
                fetch(`api/ticketstatus`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(
                    response => response.json() as Promise<TicketStatusItem[]>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_TICKETSTATUS', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
            }
        }
};

const unloadedState: TicketStatusState = {
    data: null
};

export const reducer: Reducer<TicketStatusState> = (
    state: TicketStatusState | undefined, incomingAction: Action): TicketStatusState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type)
    {
        case 'RECEIVE_TICKETSTATUS':
            if (state.data === null)
            {
                let newState = {
                    data: action.data
                }

                return { ...state, ...newState }
            }
            break;
    }

    return state;
};