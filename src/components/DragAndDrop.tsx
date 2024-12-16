import { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

type Props = {
  file: File | null;
  onChange: (file: File) => void;
};

const DragAndDrop = ({ file, onChange }: Props) => {
  // const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 rounded-lg text-center h-28 ${
        isDragActive ? 'border-blue-600 bg-blue-100' : 'border-teal-500'
      }`}
    >
      <input {...getInputProps()} />
      {file ? (
        <p className="text-sm text-green-600">File Selected: {file.name}</p>
      ) : (
        <p className="text-sm text-gray-500">
          {isDragActive
            ? 'Drop the image here...'
            : 'Drag & drop an image, or click to select'}
        </p>
      )}
    </div>
  );
};

export default DragAndDrop;
