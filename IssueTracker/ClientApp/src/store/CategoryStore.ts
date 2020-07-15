import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import PaginationResponseModel from './shared/PaginationResponseModel';
import MessageResponseModel from './shared/MessageResponseModel';
import { StartLoadingAction, EndLoadingAction } from './LoadingStore';

export interface CategoryState
{
    data: PaginationResponseModel<CategoryItem> & MessageResponseModel,
    searchedData: CategoryItem
}

export interface CategoryItem {
    id: string
    name: string
}

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


type KnownAction = RequestCategoryAction | ReceiveCategoryAction
    | StartLoadingAction | EndLoadingAction | ClearSearchCategoryAction;


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


export const unloadedState: CategoryState = {
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