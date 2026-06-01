"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";
import { findLocalImage } from "@/lib/packageStore";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackName?: string;
}

export default function FallbackImage({ src, alt, fallbackName, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        const local = findLocalImage(fallbackName || alt || "");
        if (imgSrc !== local) {
          setImgSrc(local);
        }
      }}
    />
  );
}
