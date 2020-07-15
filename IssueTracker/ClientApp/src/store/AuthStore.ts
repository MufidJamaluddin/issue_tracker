import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

import { merge } from 'lodash'

export interface LoginState {
    data: LoginItem
    code: string
    status: boolean
    message: string
}

export interface LoginItem {
    id: string
    name: string
    email: string
    image: string
    token: string
}

interface RequestLoginAction {
    type: 'REQUEST_LOGIN'
    email: string
    password: string
}

interface RequestLogoutAction {
    type: 'REQUEST_LOGOUT'
}

interface ReceiveLoginAction {
    type: 'RECEIVE_LOGIN'
    data: LoginState
}

interface ReceiveLoginDataAction {
    type: 'RECEIVE_LOGIN_USER_DATA'
    data: LoginItem
}

type KnownAction = RequestLoginAction | ReceiveLoginAction | StartLoadingAction | EndLoadingAction
    | RequestLogoutAction | ReceiveLoginDataAction

export const getLoginData = function () {
    const fetchData = fetch(`api/login`, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(
        response => response.json() as Promise<LoginItem>
    )

    return fetchData
}

export const actionCreators = {

    requestUserData: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.authStore &&
                (appState.authStore.data.token == null || appState.authStore.data.token == undefined)
            ) {
                dispatch({ type: 'START_LOADING' });

                getLoginData().then(userdata => {
                    dispatch({ type: 'RECEIVE_LOGIN_USER_DATA', data: userdata });
                    dispatch({ type: 'END_LOADING' });
                }).catch(ex => {
                    dispatch({ type: 'END_LOADING' });
                })
            }
        },

    requestLogin: (email: string, password: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.authStore &&
                (appState.authStore.data.token == null || appState.authStore.data.token == undefined)
            ) {
                dispatch({ type: 'START_LOADING' });

                const requestData = {
                    email: email,
                    password: password,
                }

                fetch(`api/login`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                })
                .then(
                    response => response.json() as Promise<LoginState>
                )
                .then(data => {
                    data['token'] = 'abcdefgh'

                    dispatch({ type: 'RECEIVE_LOGIN', data: { ...data } });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'REQUEST_LOGIN', email: email, password: password });
            }
        },

    requestLogout: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            console.log('CALL Logout..')

            if (
                appState &&
                appState.authStore
            ) {
                dispatch({ type: 'START_LOADING' });

                fetch(`api/login`, {
                    method: 'DELETE',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => {
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'REQUEST_LOGOUT' });
            }
        },

};

const unloadedState: LoginState = {
    data: {
        name: null,
        email: null,
        token: null,
        image: null,
        id: null,
    },
    code: null,
    message: null,
    status: true,
};

export const reducer: Reducer<LoginState> = (
    state: LoginState | undefined, incomingAction: Action): LoginState => {

    if (state === undefined)
    {
        return unloadedState
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {

        case 'RECEIVE_LOGIN_USER_DATA':

            newState = {
                ...unloadedState,
                data: action.data,
            }

            return merge({}, newState)

        case 'REQUEST_LOGIN':

            return state

        case 'REQUEST_LOGOUT':

            newState = merge({}, unloadedState)

            return newState

        case 'RECEIVE_LOGIN':

            newState = {
                ...state,
                ...action.data,
            }

            return newState

        default:
            return state;
    }
};