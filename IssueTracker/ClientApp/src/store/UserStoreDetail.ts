import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';
import MessageResponseModel from './shared/MessageResponseModel';

import { merge } from 'lodash'

export interface OneUserState {
    data: UserItem
    status: boolean
    code: string
    message: string
}

export interface UserItem {
    id: string
    name: string
    email: string
    image?: string
}

interface RequestOneUserAction {
    type: 'REQUEST_ONE_USER'
    id: string
}

interface ReceiveOneUserAction {
    type: 'RECEIVE_ONE_USER'
    data: UserItem
}

interface RequestUpdateOneUserAction {
    type: 'REQUEST_UPDATE_ONE_USER'
    id: string
    data: UserItem
}

interface RequestBlankOneUserAction {
    type: 'REQUEST_BLANK_ONE_USER'
}

interface RequestInsertOneUserAction {
    type: 'REQUEST_INSERT_ONE_USER'
}

interface ReceiveInsertOneUserAction {
    type: 'RECEIVE_INSERT_ONE_USER'
    data: MessageResponseModel & OneUserState
}

interface ReceiveUpdateOneUserAction {
    type: 'RECEIVE_UPDATE_ONE_USER'
    data: MessageResponseModel & OneUserState
}

interface RequestDeleteOneUserAction {
    type: 'REQUEST_DELETE_ONE_USER'
    id: string
}

interface ReceiveDeleteOneUserAction {
    type: 'RECEIVE_DELETE_ONE_USER'
    data: MessageResponseModel & OneUserState
}

type KnownAction = RequestOneUserAction | ReceiveOneUserAction | RequestBlankOneUserAction
    | RequestInsertOneUserAction | ReceiveInsertOneUserAction
    | RequestUpdateOneUserAction | ReceiveUpdateOneUserAction
    | RequestDeleteOneUserAction | ReceiveDeleteOneUserAction
    | StartLoadingAction | EndLoadingAction


export const actionCreators = {

    requestOneUser: (id: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                id != null && id != ''
            ) {
                fetch(`api/user/get/${id}`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(
                    response => response.json() as Promise<UserItem>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_ONE_USER', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_ONE_USER', id: id });
            }
        },


    requestBlankOneUser: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                appState.ticketStoreDetail.data.id !== '' &&
                appState.ticketStoreDetail.data.id !== null
            ) {
                dispatch({ type: 'REQUEST_BLANK_ONE_USER' })
            }
        },

    requestInsertOneUser: (data: UserItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                data.id == null
            ) {
                fetch('api/user', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(
                    response => response.json() as Promise<MessageResponseModel & OneUserState>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_INSERT_ONE_USER', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_INSERT_ONE_USER' });
            }
        },

    requestUpdateOneUser: (id: string, data: UserItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                id != null && id != '' && data != null
            ) {
                if (data.id == id) {
                    fetch(`api/user`, {
                        method: 'PUT',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                        .then(
                            response => response.json() as Promise<MessageResponseModel & OneUserState>
                        )
                        .then(data => {
                            dispatch({ type: 'RECEIVE_UPDATE_ONE_USER', data: data });
                            dispatch({ type: 'END_LOADING' });
                        })
                        .catch(exception => {
                            dispatch({ type: 'END_LOADING' });
                        });

                    dispatch({ type: 'START_LOADING' });
                    dispatch({ type: 'REQUEST_UPDATE_ONE_USER', id: id, data: data });
                }
            }
        },

    requestDeleteOneUser: (id: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                id != null && id != ''
            ) {
                fetch(`api/user`, {
                    method: 'DELETE',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: id
                    })
                })
                .then(
                    response => response.json() as Promise<MessageResponseModel & OneUserState>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_DELETE_ONE_USER', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_DELETE_ONE_USER', id: id });
            }
        },

};


const unloadedState: OneUserState = {
    data: {
        id: null,
        name: '',
        email: '',
        image: '',
    },
    status: true,
    code: '',
    message: '',
};

const getRequiredData = (data?: UserItem) => {

    if (!data) return unloadedState.data

    try {
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            image: data.image,
        }
    }
    catch (e) {
        return unloadedState.data
    }
}

export const reducer: Reducer<OneUserState> = (
    state: OneUserState | undefined, incomingAction: Action): OneUserState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_BLANK_ONE_USER':
            newState = merge({}, state)

            newState = {
                data: getRequiredData()
            }

            return newState

        case 'REQUEST_ONE_USER':
        case 'REQUEST_INSERT_ONE_USER':
        case 'REQUEST_UPDATE_ONE_USER':
        case 'REQUEST_DELETE_ONE_USER':

            return state;

        case 'RECEIVE_ONE_USER':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data)
            }

            return newState

        case 'RECEIVE_UPDATE_ONE_USER':
        case 'RECEIVE_INSERT_ONE_USER':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data.data),
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return newState

        case 'RECEIVE_DELETE_ONE_USER':

            newState = {
                data: unloadedState.data,
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return newState
    }

    return state;
};