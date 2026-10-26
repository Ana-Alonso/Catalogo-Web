import React from 'react';
import { imageClasses, type ImageProps } from './imageClasses';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  loading,
  className,
  ...props
}) => (
  <img src={src} alt={alt} loading={loading} className={imageClasses(props, className)} />
);

Image.displayName = 'Image';

export default Image;
