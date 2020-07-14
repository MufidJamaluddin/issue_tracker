import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UserState {
    isLoading: boolean
    data: PaginationResponseModel<UserItem> & MessageResponseModel
    searchedData: UserItem
}

export interface UserItem {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    password?: string
    confirm_password?: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestUserAction {
    type: 'REQUEST_USER'
    page: number
    size: number
    searchedData: UserItem
}

interface ReceiveUserAction {
    type: 'RECEIVE_USER'
    data: PaginationResponseModel<UserItem> & MessageResponseModel
}

interface ClearSearchUserAction {
    type: 'CLEAR_SEARCH_USER'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

type KnownAction = RequestUserAction | ReceiveUserAction
    | StartLoadingAction | EndLoadingAction | ClearSearchUserAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    clearSearchUser: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({ type: 'CLEAR_SEARCH_USER' })
        },

    searchUser: (page: number, size: number, searchdata: UserItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStore &&
                searchdata != null
            ) {
                const requestData = {
                    searchData: searchdata,
                    page: page,
                    size: size,
                    orderBy: 'id',
                    orderDirection: 'asc'
                }

                fetch(`api/user/search`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                    body: JSON.stringify(requestData)
                })
                .then(
                    response => response.json() as Promise<PaginationResponseModel<UserItem> & MessageResponseModel>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_USER', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_USER', page: page, size: size, searchedData: searchdata });
            }
        }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: UserState = {
    isLoading: false,
    data: {
        status: true,
        code: '',
        message: '',
        data: [],
        size: 5,
        page: 1,
        totalPages: 1,
    },
    searchedData: {
        id: '',
        email: '',
        name: '',
        role: '',
    }
};

export const reducer: Reducer<UserState> = (
    state: UserState | undefined, incomingAction: Action): UserState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null

    switch (action.type) {
        case 'REQUEST_USER':

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

        case 'RECEIVE_USER':

            newState = {
                data: action.data,
                isLoading: false
            }

            return { ...state, ...newState }


        case 'CLEAR_SEARCH_USER':

            newState = {
                searchedData: unloadedState.searchedData,
                isLoading: false
            };

            return { ...state, ...newState }
    }

    return state;
};