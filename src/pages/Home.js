import { connect } from 'react-redux';
import { setFileUpload } from '../redux/file-uploads/file-upload.action';
import UploadProgress from '../components/upload-progress';
import { checkFiles } from '../utils/functions';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';

// Home component
function Home({ checkFiles, setFileUpload }) {
  const [files, setFiles] = useState([])
  const inputFile = useRef(null);
  // Function to handle file uploads
  const handleFileUploads = () => {
    // check if any of the files is not an Image
    if (files.length <= 0) {
      toast('No file selected, Please select one or more files')
      return;
    }

    checkFiles(files)
      .then(async result => {
        if (result) {
          // Dispatch action to set file uploads
          await setFileUpload(files);
          // Clear the current file
          setFiles([]);
          if (inputFile.current) {
            inputFile.current.value = "";
            inputFile.current.type = "text";
            inputFile.current.type = "file";
          }

        } else {
          toast('Some files are not images. Only images are allowed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Render the Home component
  return (
    <div className='container' style={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
      {/* Input for file uploads */}
      <div className="input-group mb-3">
        <input type="file" className="form-control" multiple onChange={(e) => setFiles(e.target.files)} ref={inputFile} />
        <input type='button' className="input-group-text" value={'Upload'} onClick={handleFileUploads} />
      </div>
      {/* UploadProgress component */}
      <UploadProgress />
    </div>
  );
}

// Map dispatch to props
const mapDispatchToProps = dispatch => ({
  setFileUpload: files => dispatch(setFileUpload(files)),
  checkFiles: files => checkFiles(files)
})

// Connect component to Redux store
export default connect(null, mapDispatchToProps)(Home);
