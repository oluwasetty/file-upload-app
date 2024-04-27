import fileUploadTypes from "./file-upload.types";
import { modifyFiles } from "./file-upload.utils";
import { produce } from "immer";
import axios from 'axios';
import { STATUS_UPLOAD } from "../../utils/constants";

// Initial state for file progress
const INITIAL_STATE = {
    fileProgress: [],
}

// Reducer function for file progress
const fileProgressReducer = (state = INITIAL_STATE, action) =>
    produce(state, draft => {
        switch (action.type) {
            // set file upload data
            case fileUploadTypes.SET_FILE_UPLOAD:
                draft.fileProgress = modifyFiles(state.fileProgress, action.payload);
                break;

            // set upload progress
            case fileUploadTypes.SET_UPLOAD_PROGRESS:
                draft.fileProgress[action.payload.id].status = STATUS_UPLOAD.uploading;
                draft.fileProgress[action.payload.id].progress = action.payload.progress;
                break;

            // successful file upload
            case fileUploadTypes.SUCCESS_UPLOAD_FILE:
                draft.fileProgress[action.payload].status = STATUS_UPLOAD.success;
                break;

            // failed file upload
            case fileUploadTypes.FAILURE_UPLOAD_FILE:
                draft.fileProgress[action.payload].status = STATUS_UPLOAD.failed;
                break;

            // retry file upload
            case fileUploadTypes.RETRY_UPLOAD_FILE:
                const CancelToken = axios.CancelToken;
                const cancelSource = CancelToken.source();
                draft.fileProgress[action.payload].status = STATUS_UPLOAD.uploading;
                draft.fileProgress[action.payload].progress = 0;
                draft.fileProgress[action.payload].cancelSource = cancelSource;
                break;

            default:
                return state;
        }
    });

export default fileProgressReducer;
