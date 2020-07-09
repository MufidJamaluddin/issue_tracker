import { Action, Reducer } from 'redux';

export interface LoadingState {
    isLoading: boolean
    queueList: boolean[]
}

export interface StartLoadingAction { type: 'START_LOADING' }
export interface EndLoadingAction { type: 'END_LOADING' }

export type KnownAction = StartLoadingAction | EndLoadingAction;

export const actionCreators = {
    startLoading: () => ({ type: 'START_LOADING' } as StartLoadingAction),
    endLoading: () => ({ type: 'END_LOADING' } as EndLoadingAction)
};

export const reducer: Reducer<LoadingState> = (state: LoadingState | undefined, incomingAction: Action): LoadingState => {
    if (state === undefined) {
        return { isLoading: false, queueList: [] };
    }

    const action = incomingAction as KnownAction;
    
    var listdata;

    switch (action.type)
    {
        case 'START_LOADING':

            listdata = state.queueList.slice()
            listdata.push(true)

            return { isLoading: true, queueList: listdata }

        case 'END_LOADING':

            listdata = state.queueList.slice(1)
            return { isLoading: listdata.length !== 0, queueList: listdata }

        default:
            return state;
    }
};
