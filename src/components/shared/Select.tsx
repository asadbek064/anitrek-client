import classNames from "classnames";
import React, { CSSProperties, useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import ReactSelect, {
  components,
  GroupBase,
  OptionProps,
  Props,
} from "react-select";

const MoreSelectedBadge = ({ items }) => {
  const title = items.join(", ");
  const length = items.length;
  const label = `+${length}`;

  return (
    <p title={title} className="p-1 text-sm bg-background-700 rounded-sm">
      {label}
    </p>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 1;
  const overflow = getValue()
    .slice(maxToShow)
    .map((x: any) => x.label);

  return index < maxToShow ? (
    // @ts-ignore
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

const Option: React.ComponentType<
  OptionProps<unknown, boolean, GroupBase<unknown>>
> = ({ innerRef, getValue, children, innerProps, ...props }) => {
  const { className, ...divProps } = innerProps;

  return (
    <div
      ref={innerRef}
      className={classNames(
        "cursor-pointer relative px-3 py-2 transition duration-200",
        props.isFocused && "bg-white/20 text-primary-300",
        className
      )}
      {...divProps}
    >
      {children}

      {props.isSelected && (
        <AiFillCheckCircle className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 rounded-full bg-white" />
      )}
    </div>
  );
};

const Select = React.forwardRef<any, Props>(
  ({ components, styles, ...props }, ref) => {
    const [portalTarget, setPortalTarget] = React.useState<HTMLElement>();

    useEffect(() => {
      setPortalTarget(document.body);
    }, []);

    return (
      <ReactSelect
        ref={ref}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#0ea5e9",
            primary75: "#22d3ee",
            primary50: "#67e8f9",
            primary20: "#67e8f9",
          },
        })}
        styles={{
          control: (provided) => {
            return {
              ...provided,
              backgroundColor: "#1a1a1a",
              minWidth: "14rem",
              maxWidth: "16rem",
            };
          },
          menu: (provided) => {
            return { ...provided, backgroundColor: "#1a1a1a" };
          },
          menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
          singleValue: (provided) => {
            return { ...provided, color: "#fff" };
          },
          multiValue: (provided) => {
            return {
              ...provided,
              backgroundColor: "#262626",
              maxWidth: "80%",
            };
          },
          multiValueLabel: (provided) => {
            return { ...provided, color: "white" };
          },
          multiValueRemove: (provided) => {
            return {
              ...provided,
              color: "gray",
              ":hover": {
                backgroundColor: "transparent",
                color: "white",
              },
              transition: "all 200ms",
            };
          },

          input: (provided) => {
            return { ...provided, color: "white" };
          },

          ...styles,
        }}
        hideSelectedOptions={false}
        noOptionsMessage={() => "No more options"}
        components={{ MultiValue, Option, ...components }}
        isClearable
        menuPortalTarget={portalTarget}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export default React.memo(Select);
