'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  src: string;
  alt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    // Function to handle clicks outside the modal content
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('modal-content');
      if (modal && !modal.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Attach event listener to the document
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="my-8">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={400}
          className="mx-auto rounded-lg shadow-lg cursor-pointer"
          onClick={handleOpen}
        />
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div
            id="modal-content"
            className="relative bg-white p-4 rounded-lg"
          >
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 text-black bg-gray-300 rounded-full"
            >
              X
            </button>
            <Image
              src={src}
              alt={alt}
              width={1000}
              height={500}
              className="mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
