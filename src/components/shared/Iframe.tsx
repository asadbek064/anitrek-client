import React from "react";

const Iframe = ({ src }) => {

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
    <iframe
    title="iframe boy"
    src={src}
    allowFullScreen
    ></iframe>
  );
};

export default Iframe;
