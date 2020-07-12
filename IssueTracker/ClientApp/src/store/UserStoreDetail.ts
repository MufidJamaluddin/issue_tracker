﻿import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';
import MessageResponseModel from './shared/MessageResponseModel';

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

type KnownAction = RequestOneUserAction | ReceiveOneUserAction
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
                fetch(`api/category/get/${id}`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.authStore.data.token}`
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

    requestUpdateOneUser: (id: string, data: UserItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                id != null && id != '' && data != null
            ) {
                if (data.id == id) {
                    fetch(`api/category`, {
                        method: 'PUT',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${appState.authStore.data.token}`
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
                fetch(`api/category`, {
                    method: 'DELETE',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.authStore.data.token}`
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

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OneUserState = {
    data: {
        id: '',
        name: '',
        email: '',
        image: '',
    },
    status: true,
    code: '',
    message: '',
};

export const reducer: Reducer<OneUserState> = (
    state: OneUserState | undefined, incomingAction: Action): OneUserState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_ONE_USER':
        case 'REQUEST_UPDATE_ONE_USER':
        case 'REQUEST_DELETE_ONE_USER':

            return state;

        case 'RECEIVE_ONE_USER':

            newState = {
                data: action.data
            }

            return { ...state, ...newState }

        case 'RECEIVE_UPDATE_ONE_USER':

            newState = {
                data: action.data.data,
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return { ...state, ...newState }

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