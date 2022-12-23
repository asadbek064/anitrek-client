import classNames from "classnames";
import React from "react";
import Image from "@/components/shared/Image";
import { isMobile } from "react-device-detect";
const Logo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("relative flex mx-auto h-24 w-24 mb-8", className)}
      {...props}
    >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="205"
        height="32.5"
        x="0"
        y="0"
        version="1.1"
        viewBox="0 0 205 32.5"
        xmlSpace="preserve"
      >
        <defs>
          <path id="SVGID_1_" d="M0 0H205V32.5H0z"></path>
        </defs>
        <clipPath>
          <use overflow="visible" xlinkHref="#SVGID_1_"></use>
        </clipPath>
        <defs>
          <path
            id="SVGID_3_"
            d="M9.618 23.415c-.51-.557-.764-1.297-.764-2.223 0-1.351.326-2.43.978-3.234.652-.807 1.499-1.21 2.542-1.21.901 0 1.606.279 2.116.835.509.558.765 1.299.765 2.223 0 1.352-.327 2.431-.978 3.236-.653.806-1.5 1.209-2.543 1.209-.901 0-1.606-.278-2.116-.836M5.903 11.876c-1.588.973-2.851 2.312-3.787 4.019-.937 1.706-1.405 3.604-1.405 5.689 0 1.848.385 3.455 1.156 4.818.77 1.363 1.772 2.4 3.005 3.111 1.232.711 2.512 1.066 3.84 1.066 2.039 0 3.793-.711 5.262-2.134l-.355 1.778h7.574l3.876-19.451h-8.036l-.427 2.063c-1.091-1.612-2.94-2.418-5.548-2.418a9.725 9.725 0 00-5.155 1.459"
          ></path>
        </defs>
        <clipPath id="SVGID_4_">
          <use overflow="visible" xlinkHref="#SVGID_3_"></use>
        </clipPath>
        <linearGradient
          id="SVGID_5_"
          x1="0"
          x2="1"
          y1="32.477"
          y2="32.477"
          gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#F72953"></stop>
          <stop offset="0.369" stopColor="#F72953"></stop>
          <stop offset="0.581" stopColor="#F72953"></stop>
          <stop offset="0.627" stopColor="#F73D53"></stop>
          <stop offset="0.712" stopColor="#F75E52"></stop>
          <stop offset="0.759" stopColor="#F76A52"></stop>
          <stop offset="0.846" stopColor="#F78352"></stop>
          <stop offset="0.938" stopColor="#F79751"></stop>
          <stop offset="1" stopColor="#F79E51"></stop>
        </linearGradient>
        <path
          fill="url(#SVGID_5_)"
          d="M0.711 10.419H25.069V30.580000000000002H0.711z"
          clipPath="url(#SVGID_4_)"
        ></path>
        <defs>
          <path
            id="SVGID_6_"
            d="M40.306 10.987a8.217 8.217 0 00-2.756 1.744l.391-1.957h-7.574l-3.875 19.451h8.036l1.884-9.351c.498-2.466 1.694-3.699 3.591-3.699 1.351 0 2.027.699 2.027 2.099 0 .213-.048.604-.142 1.173l-1.956 9.778h8.037l2.133-10.738c.166-.83.249-1.647.249-2.453 0-2.133-.635-3.77-1.902-4.907-1.269-1.139-2.958-1.707-5.068-1.707a8.642 8.642 0 00-3.075.567"
          ></path>
        </defs>
        <clipPath id="SVGID_7_">
          <use overflow="visible" xlinkHref="#SVGID_6_"></use>
        </clipPath>
        <linearGradient
          id="SVGID_8_"
          x1="0"
          x2="1"
          y1="32.477"
          y2="32.477"
          gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#F72953"></stop>
          <stop offset="0.369" stopColor="#F72953"></stop>
          <stop offset="0.581" stopColor="#F72953"></stop>
          <stop offset="0.627" stopColor="#F73D53"></stop>
          <stop offset="0.712" stopColor="#F75E52"></stop>
          <stop offset="0.759" stopColor="#F76A52"></stop>
          <stop offset="0.846" stopColor="#F78352"></stop>
          <stop offset="0.938" stopColor="#F79751"></stop>
          <stop offset="1" stopColor="#F79E51"></stop>
        </linearGradient>
        <path
          fill="url(#SVGID_8_)"
          d="M26.492 10.419H50.351V30.225H26.492z"
          clipPath="url(#SVGID_7_)"
        ></path>
        <g>
          <defs>
            <path
              id="SVGID_9_"
              d="M57.107 10.774l-3.876 19.451h8.001l3.876-19.451h-8.001zm1.742-8.499c-.948.831-1.422 1.874-1.422 3.131 0 1.089.414 1.997 1.244 2.719.83.724 1.932 1.085 3.308 1.085 1.54 0 2.779-.415 3.716-1.245.936-.83 1.404-1.92 1.404-3.271 0-1.09-.415-1.973-1.245-2.649-.83-.676-1.932-1.014-3.307-1.014-1.517 0-2.75.415-3.698 1.244"
            ></path>
          </defs>
          <clipPath id="SVGID_10_">
            <use overflow="visible" xlinkHref="#SVGID_9_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_11_"
            x1="0"
            x2="1"
            y1="32.5"
            y2="32.5"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_11_)"
            d="M53.231 1.031H67.099V30.224999999999998H53.231z"
            clipPath="url(#SVGID_10_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_12_"
              d="M91.919 11.219a8.753 8.753 0 00-3.023 2.294 5.604 5.604 0 00-2.383-2.312c-1.019-.521-2.133-.782-3.341-.782-.997 0-1.969.184-2.916.551-.949.367-1.826.931-2.632 1.689l.391-1.885h-7.574l-3.875 19.451h8.036l1.884-9.493c.498-2.37 1.553-3.557 3.165-3.557.544 0 .972.178 1.281.533.306.356.461.89.461 1.601 0 .403-.047.806-.142 1.209l-1.956 9.707h8.036l1.921-9.636c.45-2.277 1.493-3.414 3.129-3.414.545 0 .972.178 1.28.533.308.356.463.89.463 1.601 0 .403-.048.806-.143 1.209l-1.956 9.707h8.036l2.134-10.738c.166-.807.249-1.612.249-2.417 0-2.134-.623-3.776-1.867-4.925-1.245-1.15-2.862-1.725-4.853-1.725-1.376-.001-2.644.266-3.805.799"
            ></path>
          </defs>
          <clipPath id="SVGID_13_">
            <use overflow="visible" xlinkHref="#SVGID_12_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_14_"
            x1="0"
            x2="1"
            y1="32.477"
            y2="32.477"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_14_)"
            d="M66.566 10.419H102.444V30.225H66.566z"
            clipPath="url(#SVGID_13_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_15_"
              d="M116.08 16.588c.581-.463 1.31-.693 2.187-.693.878 0 1.577.23 2.099.693s.782 1.097.782 1.903h-6.365c.285-.806.716-1.44 1.297-1.903m-3.751-4.729c-1.826.96-3.242 2.288-4.249 3.983-1.008 1.695-1.512 3.609-1.512 5.742 0 1.825.444 3.414 1.334 4.765.889 1.352 2.145 2.395 3.769 3.129 1.624.735 3.49 1.103 5.602 1.103 3.295 0 6.127-.805 8.499-2.418l-3.344-4.871c-1.21.901-2.62 1.351-4.231 1.351-1.091 0-1.944-.178-2.561-.533-.617-.355-1.008-.937-1.173-1.741h13.619c.284-1.187.425-2.313.425-3.379 0-1.684-.39-3.17-1.172-4.462-.782-1.291-1.92-2.299-3.414-3.023-1.493-.723-3.26-1.084-5.298-1.084-2.371-.002-4.469.478-6.294 1.438"
            ></path>
          </defs>
          <clipPath id="SVGID_16_">
            <use overflow="visible" xlinkHref="#SVGID_15_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_17_"
            x1="0"
            x2="1"
            y1="32.477"
            y2="32.477"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_17_)"
            d="M106.568 10.419H128.506V30.580000000000002H106.568z"
            clipPath="url(#SVGID_16_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_18_"
              d="M136.152 6.401l-1.103 5.44h-2.666l-1.174 5.867h2.702l-.995 4.907a9.116 9.116 0 00-.214 1.921c0 1.92.635 3.407 1.904 4.462 1.267 1.055 3.003 1.582 5.208 1.582 2.134 0 3.888-.379 5.263-1.137l-.925-5.406c-.663.309-1.256.463-1.777.463-.996 0-1.494-.45-1.494-1.351 0-.096.023-.284.071-.57l.96-4.871h3.981l1.175-5.867h-3.982l1.103-5.44h-8.037z"
            ></path>
          </defs>
          <clipPath id="SVGID_19_">
            <use overflow="visible" xlinkHref="#SVGID_18_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_20_"
            x1="0"
            x2="1"
            y1="32.486"
            y2="32.486"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_20_)"
            d="M131.21 6.401H147.06900000000002V30.58H131.21z"
            clipPath="url(#SVGID_19_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_21_"
              d="M150.198 22.775c-.974.913-1.458 2.104-1.458 3.573 0 1.233.41 2.246 1.227 3.04.818.795 1.878 1.191 3.183 1.191 1.398 0 2.584-.456 3.556-1.369.971-.912 1.458-2.103 1.458-3.573 0-1.257-.403-2.276-1.209-3.059s-1.862-1.172-3.164-1.172c-1.424.001-2.621.457-3.593 1.369"
            ></path>
          </defs>
          <clipPath id="SVGID_22_">
            <use overflow="visible" xlinkHref="#SVGID_21_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_23_"
            x1="0"
            x2="1"
            y1="32.449"
            y2="32.449"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_23_)"
            d="M148.74 21.407H158.163V30.58H148.74z"
            clipPath="url(#SVGID_22_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_24_"
              d="M167.23 6.401l-1.103 5.44h-2.667l-1.174 5.867h2.702l-.995 4.907a9.05 9.05 0 00-.214 1.921c0 1.92.635 3.407 1.903 4.462 1.268 1.055 3.005 1.582 5.209 1.582 2.135 0 3.888-.379 5.263-1.137l-.924-5.406c-.664.309-1.258.463-1.778.463-.996 0-1.494-.45-1.494-1.351 0-.096.024-.284.072-.57l.959-4.871h3.981l1.176-5.867h-3.983l1.103-5.44h-8.036z"
            ></path>
          </defs>
          <clipPath id="SVGID_25_">
            <use overflow="visible" xlinkHref="#SVGID_24_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_26_"
            x1="0"
            x2="1"
            y1="32.486"
            y2="32.486"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_26_)"
            d="M162.287 6.401H178.147V30.58H162.287z"
            clipPath="url(#SVGID_25_)"
          ></path>
        </g>
        <g>
          <defs>
            <path
              id="SVGID_27_"
              d="M196.992 10.774L190.805 21.228 188.885 10.774 180.955 10.774 184.902 30.225 193.224 30.225 204.922 10.774z"
            ></path>
          </defs>
          <clipPath id="SVGID_28_">
            <use overflow="visible" xlinkHref="#SVGID_27_"></use>
          </clipPath>
          <linearGradient
            id="SVGID_29_"
            x1="0"
            x2="1"
            y1="32.477"
            y2="32.477"
            gradientTransform="matrix(204.2109 0 0 -204.2109 .734 6652.605)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#F72953"></stop>
            <stop offset="0.369" stopColor="#F72953"></stop>
            <stop offset="0.581" stopColor="#F72953"></stop>
            <stop offset="0.627" stopColor="#F73D53"></stop>
            <stop offset="0.712" stopColor="#F75E52"></stop>
            <stop offset="0.759" stopColor="#F76A52"></stop>
            <stop offset="0.846" stopColor="#F78352"></stop>
            <stop offset="0.938" stopColor="#F79751"></stop>
            <stop offset="1" stopColor="#F79E51"></stop>
          </linearGradient>
          <path
            fill="url(#SVGID_29_)"
            d="M180.955 10.774H204.92200000000003V30.225H180.955z"
            clipPath="url(#SVGID_28_)"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default React.memo(Logo);
