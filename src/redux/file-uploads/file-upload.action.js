import fileUploadTypes from "./file-upload.types";

// Action creator to set file upload data
export const setFileUpload = data => ({
    type: fileUploadTypes.SET_FILE_UPLOAD,
    payload: data
})

// Action creator to set upload progress
export const setUploadProgress = (id, progress) => ({
    type: fileUploadTypes.SET_UPLOAD_PROGRESS,
    payload: {
        id,
        progress,
    },
})

// Action creator for successful file upload
export const successUploadFile = id => ({
    type: fileUploadTypes.SUCCESS_UPLOAD_FILE,
    payload: id,
})

// Action creator for failed file upload
export const failureUploadFile = id => ({
    type: fileUploadTypes.FAILURE_UPLOAD_FILE,
    payload: id,
})

// Action creator to retry file upload
export const retryUploadFile = id => ({
    type: fileUploadTypes.RETRY_UPLOAD_FILE,
    payload: id,
})

