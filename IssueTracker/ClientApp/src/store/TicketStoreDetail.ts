﻿import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';
import MessageResponseModel from './shared/MessageResponseModel';
import { TicketItem } from './TicketStore';

export interface OneTicketState {
    data: TicketItem
    status: boolean
    code: string
    message: string
}

interface RequestOneTicketAction {
    type: 'REQUEST_ONE_TICKET'
    id: string
}

interface ReceiveOneTicketAction {
    type: 'RECEIVE_ONE_TICKET'
    data: TicketItem
}

interface RequestUpdateOneTicketAction {
    type: 'REQUEST_UPDATE_ONE_TICKET'
    id: string
    data: TicketItem
}

interface ReceiveUpdateOneTicketAction {
    type: 'RECEIVE_UPDATE_ONE_TICKET'
    data: MessageResponseModel & OneTicketState
}

interface RequestDeleteOneTicketAction {
    type: 'REQUEST_DELETE_ONE_TICKET'
    id: string
}

interface ReceiveDeleteOneTicketAction {
    type: 'RECEIVE_DELETE_ONE_TICKET'
    data: MessageResponseModel & OneTicketState
}

type KnownAction = RequestOneTicketAction | ReceiveOneTicketAction
    | RequestUpdateOneTicketAction | ReceiveUpdateOneTicketAction
    | RequestDeleteOneTicketAction | ReceiveDeleteOneTicketAction
    | StartLoadingAction | EndLoadingAction


export const actionCreators = {

    requestOneTicket: (id: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                id != null && id != ''
            ) {
                fetch(`api/Ticket/get/${id}`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                })
                    .then(
                        response => response.json() as Promise<TicketItem>
                    )
                    .then(data => {
                        dispatch({ type: 'RECEIVE_ONE_TICKET', data: data });
                        dispatch({ type: 'END_LOADING' });
                    })
                    .catch(exception => {
                        dispatch({ type: 'END_LOADING' });
                    });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_ONE_TICKET', id: id });
            }
        },

    requestUpdateOneTicket: (id: string, data: TicketItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                id != null && id != '' && data != null
            ) {
                if (data.id == id) {
                    fetch(`api/Ticket`, {
                        method: 'PUT',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${appState.authStore.data.token}`
                        },
                        body: JSON.stringify(data)
                    })
                        .then(
                            response => response.json() as Promise<MessageResponseModel & OneTicketState>
                        )
                        .then(data => {
                            dispatch({ type: 'RECEIVE_UPDATE_ONE_TICKET', data: data });
                            dispatch({ type: 'END_LOADING' });
                        })
                        .catch(exception => {
                            dispatch({ type: 'END_LOADING' });
                        });

                    dispatch({ type: 'START_LOADING' });
                    dispatch({ type: 'REQUEST_UPDATE_ONE_TICKET', id: id, data: data });
                }
            }
        },

    requestDeleteOneTicket: (id: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                id != null && id != ''
            ) {
                fetch(`api/Ticket`, {
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
                        response => response.json() as Promise<MessageResponseModel & OneTicketState>
                    )
                    .then(data => {
                        dispatch({ type: 'RECEIVE_DELETE_ONE_TICKET', data: data });
                        dispatch({ type: 'END_LOADING' });
                    })
                    .catch(exception => {
                        dispatch({ type: 'END_LOADING' });
                    });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_DELETE_ONE_TICKET', id: id });
            }
        },

};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OneTicketState = {
    data: {
        id: '',
        name: '',
        description: '',
        created_date: null,
        category_name: '',
        assignee: '',
        owner: '',
        status: '',
        status_id: null,
    },
    status: true,
    code: '',
    message: '',
};

export const reducer: Reducer<OneTicketState> = (
    state: OneTicketState | undefined, incomingAction: Action): OneTicketState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_ONE_TICKET':
        case 'REQUEST_UPDATE_ONE_TICKET':
        case 'REQUEST_DELETE_ONE_TICKET':

            return state;

        case 'RECEIVE_ONE_TICKET':

            newState = {
                data: action.data
            }

            return { ...state, ...newState }

        case 'RECEIVE_UPDATE_ONE_TICKET':

            newState = {
                data: action.data.data,
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return { ...state, ...newState }

        case 'RECEIVE_DELETE_ONE_TICKET':

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