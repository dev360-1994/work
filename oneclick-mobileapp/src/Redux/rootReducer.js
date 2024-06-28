import { combineReducers } from 'redux';
import home from '../Redux/Reducer/home';

// Combine all the application's reducers
// The key must be router for routing
const rootReducer = () => combineReducers({
  home,
});

export default rootReducer;