import Head from "@/components/shared/Head";
import { DISCORD_URL, FACEBOOK_URL } from "@/constants";
import classNames from "classnames";
import React from "react";
import { AiFillFacebook } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

const contact = () => {
  return (
    <div className="px-4 md:px-12 pt-20 space-y-4">
      <Head title="Contact - AniTrek" description="Contact us." />

      <h1 className="text-2xl font-bold">Contact us</h1>

      <p className="text-lg">
        You can contact us through the following methods
      </p>

      <div className="flex items-center space-x-4">
        <ContactItem
          Icon={FaDiscord}
          name="Discord"
          href={DISCORD_URL}
          iconContainerClassName="bg-[#7289da]"
        />
      </div>
    </div>
  );
};

type ContactItemProps = {
  Icon: React.ComponentType<any>;
  name: string;
  iconContainerClassName?: string;
  href: string;
};

const ContactItem: React.FC<ContactItemProps> = ({
  Icon,
  name,
  iconContainerClassName,
  href,
}) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <div className="flex items-center rounded-full bg-background-800 p-2">
        <div className={classNames("p-2 rounded-full", iconContainerClassName)}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="px-4">{name}</p>
      </div>
    </a>
  );
};

export default contact;
