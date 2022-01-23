import React from 'react';
import ContextService from './ContextService';

// Create empty initial state.
const initialState = {};
const AppContext = React.createContext(initialState);
const { Provider } = AppContext;

const appContextReducer = (state, action) => {
  /**
   * Reducer for App Context.
   */
   if (ContextService.canReduce(action)) {
    return {
      ...state,
      ...ContextService.reduce(action)
    };
  }
  return state;
};

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(appContextReducer, initialState);
  const value = React.useMemo(() => [state, dispatch], [state]);
  return <Provider value={value}>{children}</Provider>;
};

const contextService = new ContextService();

const useAppContext = () => {
  const context = React.useContext(AppContext);
  const state = context[0];
  const dispatch = context[1];
  contextService.setStateDispatch(state, dispatch);
  return {
    state, // App Context
    contextService
  };
};

export { useAppContext, AppContext, AppContextProvider };
