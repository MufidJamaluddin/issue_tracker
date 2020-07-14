import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';
import MessageResponseModel from './shared/MessageResponseModel';
import { TicketItem } from './TicketStore';

import { merge } from 'lodash'

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

interface RequestBlankOneTicketAction {
    type: 'REQUEST_BLANK_ONE_TICKET'
}

interface RequestInsertOneTicketAction {
    type: 'REQUEST_INSERT_ONE_TICKET'
}

interface ReceiveInsertOneTicketAction {
    type: 'RECEIVE_INSERT_ONE_TICKET'
    data: MessageResponseModel & OneTicketState
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

type KnownAction = RequestOneTicketAction | ReceiveOneTicketAction | RequestBlankOneTicketAction
    | RequestInsertOneTicketAction | ReceiveInsertOneTicketAction
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
                fetch(`api/ticket/get/${id}`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${appState.authStore.data.token}`
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

    requestBlankOneTicket: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                appState.ticketStoreDetail.data.id !== '' &&
                appState.ticketStoreDetail.data.id !== null
            ) {
                dispatch({ type: 'REQUEST_BLANK_ONE_TICKET' })
            }
        },

    requestInsertOneTicket: (data: TicketItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.ticketStoreDetail &&
                data.id == null
            ) {
                fetch('api/ticket', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                    body: JSON.stringify(data)
                })
                .then(
                    response => response.json() as Promise<MessageResponseModel & OneTicketState>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_INSERT_ONE_TICKET', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_INSERT_ONE_TICKET' });
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
                    fetch(`api/ticket`, {
                        method: 'PUT',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json',
                            //'Authorization': `Bearer ${appState.authStore.data.token}`
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
                fetch(`api/ticket`, {
                    method: 'DELETE',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': `Bearer ${appState.authStore.data.token}`
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
        id: null,
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

const getRequiredData = (data?: TicketItem) => {

    if (!data) return unloadedState.data

    try {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            created_date: data.created_date,
            category_name: data.category_name,
            assignee: data.assignee,
            owner: data.owner,
            status: data.status,
            status_id: data.status_id,
        }
    }
    catch (e) {
        return unloadedState.data
    }
}

export const reducer: Reducer<OneTicketState> = (
    state: OneTicketState | undefined, incomingAction: Action): OneTicketState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {

        case 'REQUEST_BLANK_ONE_TICKET':

            newState = merge({}, state)

            newState = {
                data: getRequiredData()
            }

            return newState

        case 'REQUEST_ONE_TICKET':
        case 'REQUEST_INSERT_ONE_TICKET':
        case 'REQUEST_UPDATE_ONE_TICKET':
        case 'REQUEST_DELETE_ONE_TICKET':

            return state;

        case 'RECEIVE_ONE_TICKET':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data)
            }

            return newState

        case 'RECEIVE_UPDATE_ONE_TICKET':
        case 'RECEIVE_INSERT_ONE_TICKET':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data.data),
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return newState

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