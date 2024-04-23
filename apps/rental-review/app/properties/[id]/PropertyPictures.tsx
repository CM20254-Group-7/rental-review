'use client';

import React from 'react';
import Image from 'next/image';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const PictureGallery: React.FC<{ pictureUrls: string[] }> = ({
  pictureUrls,
}) => {
  if (pictureUrls.length === 0) {
    return (
      <div className='aspect-w-16 aspect-h-9 relative max-w-md'>
        <Image
          className='absolute rounded-lg'
          src='/house.jpeg'
          layout='fill'
          objectFit='cover'
          alt='Image of a house'
          priority
        />
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <p className='text-lg font-semibold text-white'>
            No Images Uploaded Yet
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className='w-full max-w-md'>
      <Slide>
        {pictureUrls.map((picture, index) => (
          <div key={index} className='each-slide'>
            <div
              style={{ backgroundImage: `url(${picture})` }}
              className='relative h-96 w-full bg-cover bg-center'
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default PictureGallery;
