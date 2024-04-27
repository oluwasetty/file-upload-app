import { combineReducers } from 'redux';
import FileUpload from './file-uploads/file-upload.reducer';

// Combine reducers
const rootReducer = combineReducers({
    FileUpload, // FileUpload reducer
});

export default rootReducer;
