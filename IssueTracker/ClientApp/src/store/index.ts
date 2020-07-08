import * as CategoryStore from './CategoryStore';
import * as TicketStore from './TicketStore';
import * as UserStore from './UserStore';
import * as LoadingStore from './LoadingStore';

import * as TicketStatusStore from './TicketStatusStore';
import * as AuthStore from './AuthStore';

// The top-level state object
export interface ApplicationState {
    categoryStore: CategoryStore.CategoryState | undefined;
    ticketStore: TicketStore.TicketState | undefined;
    userStore: UserStore.UserState | undefined;

    ticketStatusStore: TicketStatusStore.TicketStatusState | undefined;

    loadingStore: LoadingStore.LoadingState | undefined;

    authStore: AuthStore.LoginState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    categoryStore: CategoryStore.reducer,
    ticketStore: TicketStore.reducer,
    userStore: UserStore.reducer,

    ticketStatusStore: TicketStatusStore.reducer,

    loadingStore: LoadingStore.reducer,

    authStore: AuthStore.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
