import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface TicketState {
    isLoading: boolean
    data: PaginationResponseModel<TicketItem> & MessageResponseModel
    searchedData: TicketItem | any
}

export interface TicketItem {
    id: string
    name: string
    description: string
    created_date: string
    assignee: string
    owner: string
    category_name: string
    status: string
    status_id: string
    see?: number
    ismyownticket?: boolean
    ismyassignedticket?: boolean
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestTicketAction {
    type: 'REQUEST_TICKET'
    page: number
    size: number
    searchedData?: TicketItem | any
}

interface ReceiveTicketAction {
    type: 'RECEIVE_TICKET'
    data: PaginationResponseModel<TicketItem> & MessageResponseModel
}

interface ClearSearchTicketAction {
    type: 'CLEAR_SEARCH_TICKET'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

type KnownAction = RequestTicketAction | ReceiveTicketAction
    | StartLoadingAction | EndLoadingAction | ClearSearchTicketAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    clearSearchTicket: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({ type: 'CLEAR_SEARCH_TICKET' })
        },

    searchTicket: (page: number, size: number, data: TicketItem|any):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStore
            ) {
                const requestData = {
                    searchData: data,
                    page: page,
                    size: size,
                    orderBy: 'id',
                    orderDirection: 'asc'
                }

                fetch(`api/ticket/search`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                    body: JSON.stringify(requestData)
                })
                .then(
                    response => response.json() as Promise<PaginationResponseModel<TicketItem> & MessageResponseModel>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_TICKET', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                    console.log(exception)
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_TICKET', page: page, size: size, searchedData: data });
            }
        },

};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: TicketState = {
    isLoading: false,
    data: {
        status: false,
        code: '',
        message: '',
        data: [],
        size: 10,
        page: 1,
        totalPages: 1
    },
    searchedData: {
        name: "",
        status_id: null,
        see: 0
    }
}

export const reducer: Reducer<TicketState> = (
    state: TicketState | undefined, incomingAction: Action): TicketState =>
{
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type)
    {
        case 'REQUEST_TICKET':

            let data = state.data
            data.page = action.page
            data.size = action.size
            data.data = []

            newState = {
                data: data,
                isLoading: true,
                searchedData: action.searchedData,
            }

            return { ...state, ...newState }

        case 'RECEIVE_TICKET':

            if (action.data.page === state.data.page)
            {
                newState = {
                    data: action.data,
                    isLoading: false
                }

                return { ...state, ...newState }
            }
            break;

        case 'CLEAR_SEARCH_TICKET':

            newState = {
                searchedData: unloadedState.searchedData,
                isLoading: false
            };

            return { ...state, ...newState }
    }

    return state;
};