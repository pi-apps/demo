import React, { useCallback } from "react";
import CheckIcon from "../check";
import ClearIcon from "../clear";
import styles from "./files-list.module.css";

const FilesListItem = ({ name, id, onClear, uploadComplete }) => {
  const handleClear = useCallback(() => {
    onClear(id);
  }, []);

  return (
    <li className={styles.files_list_item}>
      <span className={styles.files_list_item_name}>{name}</span>
      {!uploadComplete ? (
        <span
          className={styles.files_list_item_clear}
          role="button"
          aria-label="remove file"
          onClick={handleClear}
        >
          <ClearIcon />
        </span>
      ) : (
        <span role="img" className={styles.file_list_item_check}>
          <CheckIcon />
        </span>
      )}
    </li>
  );
};

const FilesList = ({ files, onClear, uploadComplete }) => {
  return (
    <ul className={styles.files_list}>
      {files.map(({ file, id }) => (
        <FilesListItem
          name={file.name}
          key={id}
          id={id}
          onClear={onClear}
          uploadComplete={uploadComplete}
        />
      ))}
    </ul>
  );
};

export { FilesList };
