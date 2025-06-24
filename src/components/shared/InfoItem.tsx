import classNames from "classnames";
import React from "react";

interface InfoItemProps {
  title: string;
  value?: string | number | React.ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value, className }) => {
  return value ? (
    <div className={classNames("text-gray-400", className)} key={title}>
      <div className="font-semibold">{title}</div>
      <div className="whitespace-pre-line flex flex-row md:flex-col gap-2">
        {value}
      </div>
    </div>
  ) : null;
};

export default InfoItem;
