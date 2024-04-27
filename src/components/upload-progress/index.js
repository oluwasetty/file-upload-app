// Import React library and useEffect hook
import React, { useEffect, useState } from 'react';

// Import connect function from react-redux to connect component to Redux store
import { connect } from 'react-redux';

// Import lodash functions
import { size, toArray } from 'lodash';

// Import upload file functions
import { uploadFile, retryUpload } from '../../apis/file-upload';

// Import UploadItem component
import UploadItem from '../upload-item';

// Import CSS module for styling
import Styles from './style.module.css';

// UploadProgress component
const UploadProgress = props => {
    // Destructure props
    const { files, uploadFile, retryUpload } = props;
    const [toggleUploadProgress, setToggleUploadProgress] = useState(false)

    // Calculate the number of uploaded files
    const uploadedFileAmount = size(files);

    // useEffect hook to upload files when there are new files added to the progress
    useEffect(() => {
        // Filter files that have not been started uploading yet
        const fileToUpload = toArray(files).filter(file => file.progress === 0);
        // Upload new files
        uploadFile(fileToUpload);
        setToggleUploadProgress(true)
    }, [uploadedFileAmount]);

    // Render the component
    return toggleUploadProgress && uploadedFileAmount > 0 ? (
        <div className={Styles.wrapper}>
            <div className={Styles.header}>
                <h5>Uploading File</h5>
                <span className={Styles.closeButton}
                    title="Close"
                    onClick={() => { setToggleUploadProgress(false) }}
                >
                    ✕
                </span>
            </div>
            <div className={Styles.scrollable}>
                {/* Map through files and render UploadItem component for each file */}
                {size(files)
                    ? toArray(files).sort((a,b) => b.id - a.id).map(file => <UploadItem key={file.id} file={file} retryUpload={() => retryUpload(file.id)} />)
                    : null}
            </div>
        </div>
    ) : null;
}

// Map state to props
const mapStateToProps = state => ({
    files: state.FileUpload?.files,
});

// Map dispatch to props
const mapDispatchToProps = () => ({
    uploadFile,
    retryUpload,
});

// Connect component to Redux store
export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
