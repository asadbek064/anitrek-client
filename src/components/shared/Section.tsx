import classNames from "classnames";
import Link from "next/link";
import React from "react";

export interface SectionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  hasPadding?: boolean;
  isTitleLink?: boolean;
  titleLink?: string;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, title, className, hasPadding = true, isTitleLink = false, titleLink }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          hasPadding && "px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36",
          className
        )}
      >
        {title && (
          isTitleLink ? (
          <div className="cursor-pointer">
            <Link href={titleLink} passHref>
              <h1 className="uppercase [font-size:var(--step-2)] font-semibold mb-4">{title} <span className="hover:text-sky-600 ease-in-out duration-100 transition lowercase [font-size:var(--step--2)]">view all</span></h1> 
            </Link>
          </div>
          ) : (
          <>
            <h1 className="uppercase [font-size:var(--step-2)] font-semibold mb-4">{title}</h1>
          </>
          )
        )}

        {children}
      </div>
    );
  }
);

Section.displayName = "Section";

export default React.memo(Section);

