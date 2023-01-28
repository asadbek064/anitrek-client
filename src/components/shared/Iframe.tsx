import useDevice from "@/hooks/useDevice";
import React from "react";

const Iframe = ({ src }) => {
  const { isMobile } = useDevice();

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (err) {
      return false;
    }
  };
  if (!isValidUrl(src)) {
    return <div>Invalid URL</div>;
  }

  return (
        isMobile ? ( 
            <iframe
            title="iframe boy"
            src={src}
            className="inline-block min-h-[30vh] w-full aspect-video "
            />
        ) : (
            
            <iframe
            title="iframe boy"
            src={src}
            className="inline-block min-h-[40rem] w-full aspect-video"
            />
        )
  );
};

export default Iframe;
