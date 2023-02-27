import axios from "axios";
import classNames from "classnames";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DropZone } from "./drop-zone";
import styles from "./file-picker.module.css";
import { FilesList } from "./files-list";
import { createHash } from 'crypto'

const FilePicker = ({ accept, uploadURL }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploadStarted, setUploadStarted] = useState(false);

  // handler called when files are selected via the Dropzone component
  const handleOnChange = useCallback((files) => {
    let filesArray = Array.from(files);

    filesArray = filesArray.map((file) => ({
      id: nanoid(),
      file
    }));

    setFiles(filesArray);
    setProgress(0);
    setUploadStarted(false);
  }, []);

  // handle for removing files form the files list view
  const handleClearFile = useCallback((id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  // whether to show the progress bar or not
  const canShowProgress = useMemo(() => files.length > 0, [files.length]);

  function getBase64(file) {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }else {
      console.log("not an image file" + file.type);
    }
   
    // var md5 = CryptoJS.MD5(binary).toString();
    // reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

  // execute the upload operation
  const handleUpload = useCallback(async () => {
    try {
      const data = new FormData();

      files.forEach((file) => {
        data.append("file", file.file);
        // const hash = getBase64(file) ;
        // const buff = fs.readFileSync(file);
        const hash = createHash("md5").update(file).digest("hex")
        console.log(hash);
      });
      
      console.log();

      const res = await axios.request({
        url: uploadURL,
        method: "POST",
        data,
        onUploadProgress: (progressEvent) => {
          setUploadStarted(true);
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      setUploadStarted(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, [files.length]);

  // set progress to zero when there are no files
  useEffect(() => {
    if (files.length < 1) {
      setProgress(0);
    }
  }, [files.length]);

  // set uploadStarted to false when the upload is complete
  useEffect(() => {
    if (progress === 100) {
      setUploadStarted(false);
    }
  }, [progress]);

  const uploadComplete = useMemo(() => progress === 100, [progress]);

  return (
    <div className={styles.wrapper}>
      {/* canvas */}
      <div className={styles.canvas_wrapper}>
        <DropZone onChange={handleOnChange} accept={accept} />
      </div>

      {/* files listing */}
      {files.length ? (
        <div className={styles.files_list_wrapper}>
          <FilesList
            files={files}
            onClear={handleClearFile}
            uploadComplete={uploadComplete}
          />
        </div>
      ) : null}

      {/* progress bar */}
      {canShowProgress ? (
        <div className={styles.files_list_progress_wrapper}>
          <progress value={progress} max={100} style={{ width: "100%" }} />
        </div>
      ) : null}

      {/* upload button */}
      {files.length ? (
        <button
          onClick={handleUpload}
          className={classNames(
            styles.upload_button,
            uploadComplete || uploadStarted ? styles.disabled : ""
          )}
        >
          {`Upload ${files.length} Files`}
        </button>
      ) : null}
    </div>
  );
};

export { FilePicker };
