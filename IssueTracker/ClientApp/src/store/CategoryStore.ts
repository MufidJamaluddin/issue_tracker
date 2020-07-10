﻿import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CategoryState
{
    data: PaginationResponseModel<CategoryItem> & MessageResponseModel,
    searchedData: CategoryItem
}

export interface CategoryItem {
    id: string
    name: string
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCategoryAction {
    type: 'REQUEST_CATEGORY'
    page: number
    size: number
    searchedData: CategoryItem
}

interface ReceiveCategoryAction {
    type: 'RECEIVE_CATEGORY'
    data: PaginationResponseModel<CategoryItem> & MessageResponseModel
}

interface ClearSearchCategoryAction {
    type: 'CLEAR_SEARCH_CATEGORY'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

type KnownAction = RequestCategoryAction | ReceiveCategoryAction
    | StartLoadingAction | EndLoadingAction | ClearSearchCategoryAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    clearSearchCategory: ():
        AppThunkAction<KnownAction> => (dispatch, getState) => {
            dispatch({ type: 'CLEAR_SEARCH_CATEGORY' })
        },

    searchCategory: (page: number, size: number, searchedData: CategoryItem | any):
        AppThunkAction<KnownAction> => (dispatch, getState) => {

            const appState = getState();

            if (
                appState &&
                appState.categoryStore &&
                searchedData != null
            )
            {
                const requestData = {
                    searchData: searchedData,
                    page: page,
                    size: size,
                    orderBy: 'id',
                    orderDirection: 'asc'
                }

                fetch(`api/category/search`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${appState.authStore.data.token}`
                    },
                    body: JSON.stringify(requestData)
                })
                .then(
                    response => response.json() as Promise<PaginationResponseModel<CategoryItem> & MessageResponseModel>
                )
                .then(data => {
                    dispatch({ type: 'RECEIVE_CATEGORY', data: data });
                    dispatch({ type: 'END_LOADING' });
                })
                .catch(exception => {
                    dispatch({ type: 'END_LOADING' });
                });

                dispatch({ type: 'START_LOADING' });
                dispatch({ type: 'REQUEST_CATEGORY', page: page, size: size, searchedData: searchedData });
            }

        }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CategoryState = {
    data: {
        status: false,
        code: '',
        message: '',
        data: [],
        size: 10,
        page: 1,
        totalPages: 1,
    },
    searchedData: {
        id: '',
        name: '',
    }
};

export const reducer: Reducer<CategoryState> = (
    state: CategoryState | undefined, incomingAction: Action): CategoryState =>
{
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    let newState = null;

    switch (action.type) {
        case 'REQUEST_CATEGORY':

            let data = state.data
            data.page = action.page
            data.size = action.size
            data.data = []

            newState = {
                data: data,
                isLoading: true,
                searchedData: action.searchedData,
            }

            return { ...state, ...newState };

        case 'RECEIVE_CATEGORY':

            if (action.data.page === state.data.page) {

                newState = {
                    data: action.data,
                    isLoading: false
                }

                return { ...state, ...newState }
            }
            break;

        case 'CLEAR_SEARCH_CATEGORY':

            newState = {
                searchedData: unloadedState.searchedData,
                isLoading: false
            };

            return { ...state, ...newState }
    }

    return state;
};