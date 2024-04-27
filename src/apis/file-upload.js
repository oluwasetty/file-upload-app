import api from './'
import axios from 'axios';
import { setUploadProgress, successUploadFile, failureUploadFile, retryUploadFile } from '../redux/file-uploads/file-upload.action';
import store from '../redux/store';
import { FILE_STATUS } from '../utils/constants';

// Function to initiate file upload
export const uploadFile = files => {
    // Iterate through each file and get URL
    if (files.length) {
        files.forEach(async file => {
            get_url(file);
        })
    }
}

// Function to retry file upload
export const retryUpload = (id) => {
    // Dispatch action to mark file for retry
    store.dispatch(retryUploadFile(id))

    // Get current file progress from state
    const { fileProgress } = store.getState().FileUpload
    const reuploadFile = [fileProgress[id]]

    // Call action to upload the file again
    uploadFile(reuploadFile)
}

// Function to generate the presigned URL and key for staging the file
const get_url = async file => {
    // Perform an asynchronous POST request using axios
    await api.post(`/pipeline/assets/stage`)
        // Handle successful response
        .then(async res => {
            // Call the stage_file function to stage the file using the generated URL and key
            // stage_file({ file, ...res?.data }); // Use this if the cors issue is resolved
            stage_file_proxy({ file, ...res?.data }); // I am using a middleware because there's cors error while calling the presigned url
        })
        // Handle errors
        .catch(error => {
            // Log the error
            console.log(error);
            // Dispatch an action to indicate failure to upload the file
            store.dispatch(failureUploadFile(file.id));
        })
}

// Function to stage a file for upload
const stage_file = async ({ file, key, url }) => {
    // Perform an asynchronous POST request using axios
    await axios.put(url, file.file, {
        // Set the content type header
        headers: {
            'Content-Type': 'image/jpeg',
        },
        // Specify a cancel token if uploads need to be canceled
        cancelToken: file?.cancelSource?.token,
        // Callback function to track upload progress
        onUploadProgress: progress => {
            // Extract loaded and total progress values
            const { loaded, total } = progress;
            // Calculate percentage progress
            const percentageProgress = Math.floor((loaded / total) * 100);
            // Dispatch an action to update the upload progress in the Redux store
            store.dispatch(setUploadProgress(file.id, percentageProgress));
        }
    })
        // Handle successful response
        .then(res => {
            // Process the uploaded image
            process_image(file.id, key);
        })
        // Handle errors
        .catch(error => {
            // Check if the error is a cancellation error
            if (axios.isCancel(error)) {
                // Log cancellation error
                console.log(error);
            }
            // Dispatch an action to indicate failure to upload the file
            store.dispatch(failureUploadFile(file.id));
        });
}

// This function calls a middleware endpoint which I developed with .net core
const stage_file_proxy = async ({ file, key, url }) => {
    // Create a FormData object to hold the file payload
    const filePayload = new FormData();
    // Append the file to the FormData object
    filePayload.append('FileData', file.file);
    filePayload.append('S3PresignedUrl', url);

    // Perform an asynchronous POST request using axios
    await axios.put(`${process.env.REACT_APP_API_URL_PROXY}/api/pipeline/upload-to-s3`, filePayload, {
        // Set the content type header
        headers: {
            'Content-Type': 'image/jpeg',
        },
        // Specify a cancel token if uploads need to be canceled
        cancelToken: file?.cancelSource?.token,
        // Callback function to track upload progress
        onUploadProgress: progress => {
            // Extract loaded and total progress values
            const { loaded, total } = progress;
            // Calculate percentage progress
            const percentageProgress = Math.floor((loaded / total) * 100);
            // Dispatch an action to update the upload progress in the Redux store
            store.dispatch(setUploadProgress(file.id, percentageProgress));
        }
    })
        // Handle successful response
        .then(res => {
            // Process the uploaded image
            process_image(file.id, key);
        })
        // Handle errors
        .catch(error => {
            // Check if the error is a cancellation error
            if (axios.isCancel(error)) {
                // Log cancellation error
                console.log(error);
            }
            // Dispatch an action to indicate failure to upload the file
            store.dispatch(failureUploadFile(file.id));
        });
}


// Function to process the uploaded image
const process_image = async (id, key) => {
    // Create URLSearchParams object to hold data
    const data = new URLSearchParams();
    // Add pipeline and key parameters to the data
    data.append('pipeline', 'dragonfly-img-basic');
    data.append('key', key);

    // Perform an asynchronous POST request to process the image
    await api.post(`/pipeline/assets/process`, data.toString(), {
        // Set the content type header
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        // Handle successful response
        .then(res => {
            // Call the check_status function to check the status of the processing
            // check_status({ id, ...res?.data }); // Use this if the cors issue is resolved
            check_status_proxy({ id, ...res?.data }); // I am using a middleware because there's cors error while calling the status endpoint
        })
        // Handle errors
        .catch(error => {
            // Log the error
            console.log(error);
            // Dispatch an action to indicate failure to upload the file
            store.dispatch(failureUploadFile(id));
        });
}


// Function to check the status of the processing task
const check_status = async ({ id, taskId }) => {
    // Prepare data object with taskId
    let data = { taskId: taskId };

    // Perform an asynchronous POST request to check the status
    await api.post(`/pipeline/assets/status`, data, {
        // Set the content type header
        headers: {
            'Content-Type': 'application/json',
            "Cache-Control": "no-store"
        }
    })
        // Handle successful response
        .then(res => {
            // Check if the status is 'SUCCEEDED'
            if (res.data?.status === FILE_STATUS.RUNNING) {
                setTimeout(() => {check_status({ id, taskId })}, 3000) // If the status is running, recheck the status after 3s.
            }
            else if (res.data?.status === FILE_STATUS.SUCCEEDED) {
                // Dispatch an action to indicate successful upload
                store.dispatch(successUploadFile(id));
            } else {
                // Dispatch an action to indicate failure to upload the file
                store.dispatch(failureUploadFile(id));
            }
        })
        // Handle errors
        .catch(error => {
            // Log the error
            console.log(error);
        });
}



// Function to check the status of the processing task using middleware
const check_status_proxy = async ({ id, taskId }) => {
    // Prepare data object with taskId
    let data = { taskId: taskId };

    // Perform an asynchronous POST request to check the status
    await axios.post(`${process.env.REACT_APP_API_URL_PROXY}/api/pipeline/status`, data, {
        // Set the content type header
        headers: {
            'Content-Type': 'application/json',
            'apiKey': process.env.REACT_APP_API_KEY
        },
    })
        // Handle successful response
        .then(res => {
            // Check if the status is 'SUCCEEDED'
            if (res.data?.status === FILE_STATUS.RUNNING) {
                setTimeout(() => {check_status_proxy({ id, taskId })}, 3000) // If the status is running, recheck the status after 3s.
            }
            else if (res.data?.status === FILE_STATUS.SUCCEEDED) {
                // Dispatch an action to indicate successful upload
                store.dispatch(successUploadFile(id));
            } else {
                // Dispatch an action to indicate failure to upload the file
                store.dispatch(failureUploadFile(id));
            }
        })
        // Handle errors
        .catch(error => {
            // Log the error
            console.log(error);
        });
}
