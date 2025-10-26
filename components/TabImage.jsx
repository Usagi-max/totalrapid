import React, { useState, useEffect } from "react";

const TabImage = ({ src, alt, className }) => {
  useEffect(() => {
    console.log("Loading image:", src);
    const img = new Image();
    img.src = src;
    img.onload = () => console.log(`Image loaded successfully: ${src}`);
    img.onerror = (err) => console.error(`Failed to load image: ${src}`, err);
  }, [src]);

  return <img src={src} alt={alt} className={className} />;
};

export default TabImage;
