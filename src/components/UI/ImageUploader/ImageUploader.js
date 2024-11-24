// src/components/ImageUploader/ImageUploader.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import styles from './ImageUploader.module.css';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { HiOutlineUpload } from "react-icons/hi";

const ImageUploader = ({ images, setImages }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setImages([...images, ...newImages]);
    },
    [images, setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className={styles.container}>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drag and drop images here...</p>
        ) : (
          <p>
            <HiOutlineUpload /> Drag images here or click to select
          </p>
        )}
      </div>
      <div className={styles.preview}>
        {images.map((file, index) => (
          <div key={index} className={styles.thumb}>
            <div className={styles.thumbInner}>
              <img src={file.preview} alt="Preview" className={styles.img} />
              <FaTimes
                className={styles.removeIcon}
                onClick={() => removeImage(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default ImageUploader;
