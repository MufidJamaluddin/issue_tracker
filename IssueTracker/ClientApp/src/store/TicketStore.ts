import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';


export interface TicketState {
    isLoading: boolean
    data: PaginationResponseModel<TicketItem> & MessageResponseModel
    searchedData: TicketItem | any
}

export interface TicketItem {
    status_color?: string;
    id: string
    name: string
    description: string
    created_date: string
    assignee_id: string
    assignee: string
    owner_id: string
    owner: string
    category_id: string
    category_name: string
    status: string
    status_id: string
    see?: number
    ismyownticket?: boolean
    ismyassignedticket?: boolean
}


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


type KnownAction = RequestTicketAction | ReceiveTicketAction
    | StartLoadingAction | EndLoadingAction | ClearSearchTicketAction


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