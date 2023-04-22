import Head from "@/components/shared/Head";
import { DISCORD_URL, FACEBOOK_URL } from "@/constants";
import classNames from "classnames";
import React from "react";
import { AiFillDatabase, AiFillFacebook } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";

const webStats = () => {
  return (
    <div className="px-4 md:px-12 pt-20 space-y-4">
      <Head title="Contact - AnimetTV" description="Contact us." />

      <h1 className="text-2xl font-bold">Website Statistics</h1>


      <div className="flex items-center space-x-4">
       
        <ContactItem
          Icon={AiFillDatabase}
          name="Anime: 13,505"
          iconContainerClassName="bg-[#F72953]"
        />
        <ContactItem
          Icon={AiFillDatabase}
          name="Episodes: 210,667"
          iconContainerClassName="bg-[#FFE66D]"
        />

        <ContactItem
          Icon={AiFillDatabase}
          name="Manga: 3,656"
          iconContainerClassName="bg-[#49DCB1]"
        />
        <ContactItem
          Icon={AiFillDatabase}
          name="Chapters: 245,586"
          iconContainerClassName="bg-[#52DEE5]"
        />
      </div>
    </div>
  );
};

type ContactItemProps = {
  Icon: React.ComponentType<any>;
  name: string;
  iconContainerClassName?: string;
};

const ContactItem: React.FC<ContactItemProps> = ({
  Icon,
  name,
  iconContainerClassName,
}) => {
  return (
    
      <div className="flex items-center rounded-full bg-background-800 p-2">
        <div className={classNames("p-2 rounded-full", iconContainerClassName)}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="px-4">{name}</p>
      </div>
    
  );
};

export default webStats;
