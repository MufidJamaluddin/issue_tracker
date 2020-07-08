import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

export interface LoginState {
    data: LoginItemContainer & MessageResponseModel
}

export interface LoginItemContainer { data: LoginItem }

export interface LoginItem {
    id: string
    name: string
    email: string
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
    data: LoginItemContainer & MessageResponseModel
}

type KnownAction = RequestLoginAction | ReceiveLoginAction | StartLoadingAction | EndLoadingAction | RequestLogoutAction;

export const actionCreators = {
    requestLogin: (email: string, password: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.authStore &&
                appState.authStore.data.data.token === null
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
                    response => response.json() as Promise<MessageResponseModel & LoginItemContainer>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_LOGIN', data: data });
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

        },
};

const unloadedState: LoginState = {
    data: {
        status: false,
        code: '',
        message: '',
        data: {
            name: null,
            email: null,
            token: null,
            id: null,
        }
    }
};

export const reducer: Reducer<LoginState> = (
    state: LoginState | undefined, incomingAction: Action): LoginState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_LOGIN':

            newState = {
                isLoading: true
            };

            return { ...state, ...newState };

        case 'REQUEST_LOGOUT':

            newState = {
                data: {
                    name: null,
                    email: null,
                    token: null,
                    id: null,
                }
            };

            return { ...state, ...newState };

        case 'RECEIVE_LOGIN':

            newState = {
                data: action.data,
                isLoading: false
            };

            return { ...state, ...newState }
    }

    return state;
};