import { size } from 'lodash';
import axios from 'axios';
import { STATUS_UPLOAD } from '../../utils/constants';

// Function to modify files with additional information
export const modifyFiles = (existingFiles, files) => {
    // Initialize an array to store modified files
    let fileToUpload = [...existingFiles];

    // Iterate over the new files
    for (let i = 0; i < files.length; i++) {
        // Calculate the id for the new file
        const id = size(existingFiles) + i;
        // Create a cancel token for the new file
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        
        // Add the modified file to the array
        fileToUpload.push({
            id, // Unique id for the file
            file: files[i], // File object
            progress: 0, // Initial progress set to 0
            cancelSource: source, // Cancel token source
            status: STATUS_UPLOAD.uploading // Initial status set to 'uploading'
        });
    }
    
    // Return the modified files
    return fileToUpload;
}
