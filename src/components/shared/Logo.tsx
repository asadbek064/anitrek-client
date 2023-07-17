import classNames from "classnames";
import React from "react";
import Image from 'next/image'

const Logo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {

  return (
    <div
      className={classNames("relative flex mx-auto h-24 w-24 mb-8", className)}
      {...props}
    >
      <SVGComponent/>
    </div>
  );
};
const SVGComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 41"
    width={128}
    height={41}
    {...props}
  >
    <defs>
      <image
        width={128}
        height={41}
        id="img1"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAApAQMAAADH47OuAAAAAXNSR0IB2cksfwAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAPSURBVHicY2AYBaNgCAIAArkAATUcmQ4AAAAASUVORK5CYII="
      />
      <image
        width={41}
        height={41}
        id="img2"
        href="data:image/png;base64,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"
      />
      <linearGradient id="P" gradientUnits="userSpaceOnUse" />
      <linearGradient id="g1" x1={48} y1={22.5} x2={127} y2={22.5} href="#P">
        <stop stopColor="#b91c1c" />
        <stop offset={0.31} stopColor="#df342b" />
        <stop offset={1} stopColor="#f79b51" />
      </linearGradient>
    </defs>
    <style>{".a{fill:url(#g1)}"}</style>
    <use href="#img1" x={0} y={0} />
    <use href="#img2" x={2} y={0} />
    <path
      className="a"
      d="m69.3 35h8.6l-10.7-24.5h-8.2l-10.7 24.5h8.4l1.7-4.3h9.3zm-8.7-10.2l2.4-6.2 2.4 6.2zm22.6 10.2h8.3v-18.1h7.2v-6.4h-22.7v6.4h7.2zm34.9-24.5l-5.9 14.3-5.9-14.3h-8.9l10.4 24.5h8.1l10.4-24.5z"
    />
  </svg>
);

export default React.memo(Logo);
