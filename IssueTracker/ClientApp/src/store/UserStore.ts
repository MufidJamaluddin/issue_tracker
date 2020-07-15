import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';


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


type KnownAction = RequestUserAction | ReceiveUserAction
    | StartLoadingAction | EndLoadingAction | ClearSearchUserAction


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


export const unloadedState: UserState = {
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