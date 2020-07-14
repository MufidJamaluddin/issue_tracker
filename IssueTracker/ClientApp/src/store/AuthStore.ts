import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

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

type KnownAction = RequestLoginAction | ReceiveLoginAction | StartLoadingAction | EndLoadingAction
    | RequestLogoutAction;

export const actionCreators = {
    requestLogin: (email: string, password: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.authStore &&
                (appState.authStore.data.token == null || appState.authStore.data.token == undefined)
            ) {

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
                    dispatch({ type: 'RECEIVE_LOGIN', data: { ...data } });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_LOGIN', email: email, password: password });
            }
        },

    requestLogout: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.authStore &&
                appState.authStore.data.token != null &&
                appState.authStore.data.token != undefined
            ) {
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

                dispatch({ type: 'START_LOADING' });
            }

            dispatch({ type: 'REQUEST_LOGOUT' });
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
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_LOGIN':

            newState = {
                ...state
            }

            return newState

        case 'REQUEST_LOGOUT':

            newState = { ...unloadedState }

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