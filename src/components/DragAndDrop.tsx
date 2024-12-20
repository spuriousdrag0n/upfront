import { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';
import { FaPlus } from 'react-icons/fa';

type Props = {
  file: File | null;
  onChange: (file: File) => void;
};

const DragAndDrop = ({ file, onChange }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <>
      <div
        {...getRootProps()}
        // className={` text-center   ${
        //   isDragActive ? 'border-blue-600 bg-blue-100' : 'border-indigo-500'
        // }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            {/* File Selected: {file.name} */}
            <img
              src={URL.createObjectURL(file)}
              className="size-36 mx-auto rounded-lg"
            />
          </>
        ) : (
          <div className="flex justify-center items-center text-gray-500 size-20 bg-indigo-600  mx-auto rounded-full">
            <FaPlus size={35} color="#fff" />
          </div>
        )}
      </div>
    </>
  );
};

export default DragAndDrop;
