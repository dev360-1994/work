import { createStore } from 'redux';
import createRootReducer from './rootReducer';

// Configure thunk, routerMiddleware
// Creating store with reducer, middleware and app's initial state
export default function configureStore() {
  const store = createStore(createRootReducer());

  return store;
}