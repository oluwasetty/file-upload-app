// Import React library and useMemo hook
import React, { useMemo } from 'react';

// Import CSS module for styling
import Styles from './style.module.css';

// Import constants
import { STATUS_UPLOAD } from '../../utils/constants';

// UploadItem component
const UploadItem = props => {
  // Destructure props
  const { file, progress, cancelSource, status } = props.file;

  // useMemo hook to memoize the renderIcon function
  const renderIcon = useMemo(() => {
    // Function to cancel the upload
    const cancelUpload = () => {
      cancelSource.cancel('Cancelled by user');
    };

    // Conditional rendering of icon based on status
    if (status === STATUS_UPLOAD.uploading) {
      return (
        <span
          title="Cancel upload"
          style={{ color: 'red' }}
          onClick={cancelUpload}
        >
          ✕
        </span>
      );
    } else if (status === STATUS_UPLOAD.success) {
      return (
        <span
          title="Success upload"
          style={{ color: 'green', cursor: 'initial' }}
        >
          ✓
        </span>
      );
    } else if (status === STATUS_UPLOAD.failed) {
      return (
        <span
          title="Retry upload"
          style={{ color: 'orange' }}
          onClick={props.retryUpload}
        >
          ↩︎
        </span>
      );
    }

    // Return null if status is not defined
    return null;
  }, [status, props.retryUpload, cancelSource]);

  // useMemo hook to memoize the renderIcon function
  const color = useMemo(() => {

    // Conditional rendering of icon based on status
    if (status === STATUS_UPLOAD.uploading) {
      return (
        <div style={{ width: `${progress}%`, backgroundColor: 'orange' }} />
      );
    } else if (status === STATUS_UPLOAD.success) {
        return (
          <div style={{ width: `${progress}%`, backgroundColor: 'lightgreen' }} />
        );
    } else if (status === STATUS_UPLOAD.failed) {
      return (
        <div style={{ width: `${progress}%`, backgroundColor: 'red' }} />
      );
    }

    // Return null if status is not defined
    return null;
  }, [status, progress]);

  // Render the UploadItem component
  return (
    <div className={Styles.wrapperItem}>
      <div className={Styles.leftSide}>
        {/* Progress bar */}
        <div className={Styles.progressBar}>
          {/* <div style={{ width: `${progress}%`, backgroundColor: 'red' }} /> */}
          {color}
        </div>
        {/* File name label */}
        <label>{`${file.name} (${progress}%)`}</label>
      </div>
      <div className={Styles.rightSide}>
        {/* Render icon based on status */}
        {renderIcon}
      </div>
    </div>
  );
}

// Export UploadItem component
export default UploadItem;
