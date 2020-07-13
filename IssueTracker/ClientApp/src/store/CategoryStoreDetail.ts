import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';
import MessageResponseModel from './shared/MessageResponseModel';

import { merge } from 'lodash'

export interface OneCategoryState
{
    data: CategoryItem
    status: boolean
    code: string
    message: string
}

export interface CategoryItem
{
    id: string
    name: string
}

interface RequestOneCategoryAction
{
    type: 'REQUEST_ONE_CATEGORY'
    id: string
}

interface ReceiveOneCategoryAction
{
    type: 'RECEIVE_ONE_CATEGORY'
    data: CategoryItem
}

interface RequestUpdateOneCategoryAction
{
    type: 'REQUEST_UPDATE_ONE_CATEGORY'
    id: string
    data: CategoryItem
}

interface ReceiveUpdateOneCategoryAction
{
    type: 'RECEIVE_UPDATE_ONE_CATEGORY'
    data: MessageResponseModel & OneCategoryState
}

interface RequestDeleteOneCategoryAction
{
    type: 'REQUEST_DELETE_ONE_CATEGORY'
    id: string
}

interface ReceiveDeleteOneCategoryAction
{
    type: 'RECEIVE_DELETE_ONE_CATEGORY'
    data: MessageResponseModel & OneCategoryState
}

type KnownAction = RequestOneCategoryAction | ReceiveOneCategoryAction
    | RequestUpdateOneCategoryAction | ReceiveUpdateOneCategoryAction
    | RequestDeleteOneCategoryAction | ReceiveDeleteOneCategoryAction
    | StartLoadingAction | EndLoadingAction


export const actionCreators = {

    requestOneCategory: (id: string):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                appState.categoryStoreDetail.data.id !== id
            )
            {
                fetch(`api/category/get/${id}`, {
                    method: 'GET',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                })
                .then(
                    response => response.json() as Promise<CategoryItem>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_ONE_CATEGORY', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_ONE_CATEGORY', id: id });
            }
        },

    requestUpdateOneCategory: (id: string, data: CategoryItem):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStoreDetail &&
                id != null && id != '' && data != null
            ) {
                if (data.id == id)
                {
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
                        response => response.json() as Promise<MessageResponseModel & OneCategoryState>
                    )
                    .then(data => {
                        dispatch({ type: 'RECEIVE_UPDATE_ONE_CATEGORY', data: data });
                        dispatch({ type: 'END_LOADING' });
                    })
                    .catch(exception => {
                        dispatch({ type: 'END_LOADING' });
                    });

                    dispatch({ type: 'START_LOADING' });
                    dispatch({ type: 'REQUEST_UPDATE_ONE_CATEGORY', id: id, data: data });
                }
            }
        },

    requestDeleteOneCategory: (id: string):
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
                    response => response.json() as Promise<MessageResponseModel & OneCategoryState>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_DELETE_ONE_CATEGORY', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_DELETE_ONE_CATEGORY', id: id });
            }
        },

};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: OneCategoryState = {
    data: {
        id: '',
        name: ''
    },
    status: true,
    code: '',
    message: '',
};

const getRequiredData = (data?: CategoryItem) => {

    if (!data) return unloadedState.data

    try {
        return {
            id: data.id,
            name: data.name,
        }
    }
    catch (e) {
        return unloadedState.data
    }
}

export const reducer: Reducer<OneCategoryState> = (
    state: OneCategoryState | undefined, incomingAction: Action): OneCategoryState =>
{
    if (state === undefined)
    {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type)
    {
        case 'REQUEST_ONE_CATEGORY':
        case 'REQUEST_UPDATE_ONE_CATEGORY':
        case 'REQUEST_DELETE_ONE_CATEGORY':

            return state;

        case 'RECEIVE_ONE_CATEGORY':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data)
            }

            return newState

        case 'RECEIVE_UPDATE_ONE_CATEGORY':

            newState = merge({}, state)

            newState = {
                data: getRequiredData(action.data.data),
                status: action.data.status,
                code: action.data.code,
                message: action.data.message,
            }

            return newState

        case 'RECEIVE_DELETE_ONE_CATEGORY':

            newState = merge({}, state)

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