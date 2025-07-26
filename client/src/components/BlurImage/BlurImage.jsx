import React, { useState } from "react";

export const BlurImage = (props) => {
  const { src, alt, placeholderSrc, className, parentClassName } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${parentClassName}`}>
      {/* Blurred placeholder image */}
      <img
        src={placeholderSrc}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-300 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
};
