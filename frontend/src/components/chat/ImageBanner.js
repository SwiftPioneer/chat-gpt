import React from 'react';

import '../../styles/global.css';

const ImageBanner = (imgPath) => {
  console.log(imgPath);
  return (
    <div className="banner-container">
      <img className="image-banner" src={imgPath.imgPath} alt="Old Banner" />
    </div>
  );
};

export default ImageBanner;