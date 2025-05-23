import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import shopReducer from './shopReducer';
import audioReducer from './audioReducer';
import menuReducer from './menuReducer';
import locationReducer from './locationReducer';
import cameraReducer from './cameraReducer';
import statusWorkingReducer from './statusWorkingReducer';
import projectReducer from './projectReducer';

const rootReducer = combineReducers({
    user: userReducer,
    shop: shopReducer,
    audio: audioReducer,
    menu: menuReducer,
    location: locationReducer,
    camera: cameraReducer,
    status: statusWorkingReducer,
    project: projectReducer
});

export default rootReducer;
