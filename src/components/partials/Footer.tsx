import { DISCORD_URL, FACEBOOK_URL, KO_FI_URL } from "@/constants";
import React from "react";
import { FaDiscord, FaDonate } from "react-icons/fa";
import Logo from "@/components/shared/Logo";
import NextLink, { LinkProps } from "next/link";
import { useTranslation } from "next-i18next";

interface FooterItemProps {
  Icon: React.ComponentType<any>;
  href: string;
}

const Footer = ({}) => {
  const { t } = useTranslation("footer");
  
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 md:px-12 py-16 space-y-4">
      <Logo className="!mb-0" />

      <div className="flex items-center space-x-4">
        {/* <ContactItem href={DISCORD_URL} Icon={FaDiscord} />
        <ContactItem href={KO_FI_URL} Icon={FaDonate}/> */}
      </div>

      <div className="flex items-center space-x-8 text-center">
        <Link href="/tos">
          <p className="text-md md:text-lg">{t("term_of_services")}</p>
        </Link>

        {/* <Link href="/dmca">
          <p className="text-lg">{t("dmca")}</p>
        </Link> */}

        <Link href="/contact">
          <p className="text-md md:text-lg">{t("contact")}</p>
        </Link>

        <Link href="/deletion-privacy">
          <p className="text-md md:text-lg">Deletion Privacy</p>
        </Link>
        {/* <Link href="/web-stats">
          <p className="text-md md:text-lg">Website Stats</p>
        </Link> */}
      </div>

        <div className="flex flex-col justify-center items-center w-5/6 md:w-1/3 ">
        <p className="text-xs text-gray-300"> © ANIMET.SITE 2023 | Built with AniTrek API.</p>
        </div>
    </div>
  );
};

const Link: React.FC<LinkProps> = (props) => {
  return (
    <NextLink {...props}>
      <a className="hover:text-primary-300 transition duration-200">
        {props.children}
      </a>
    </NextLink>
  );
};

const ContactItem: React.FC<FooterItemProps> = ({ Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="w-6 h-6 hover:text-primary-500 transition duration-200" />
    </a>
  );
};


export default Footer;
