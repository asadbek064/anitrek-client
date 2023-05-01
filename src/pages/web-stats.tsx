import Head from "@/components/shared/Head";
import classNames from "classnames";
import React from "react";
import { AiFillDatabase } from "react-icons/ai";

const webStats = () => {
  return (
    <div className="px-4 md:px-12 pt-20 space-y-4">
      <Head title="Stats - AnimetTV" description="Website Stats" />

      <h1 className="text-2xl font-bold">Website Statistics</h1>


      <div className="flex items-center space-x-4">
       
        <Item
          Icon={AiFillDatabase}
          name="Anime: "
          value="13,505"
          iconContainerClassName="bg-[#F72953]"
        />
        <Item
          Icon={AiFillDatabase}
          name="Episodes: "
          value="13,505"
          iconContainerClassName="bg-[#FFE66D]"
        />

        <Item
          Icon={AiFillDatabase}
          name="Manga: "
          value="13,505"
          iconContainerClassName="bg-[#49DCB1]"
        />
        <Item
          Icon={AiFillDatabase}
          name="Chapters: "
          value="13,505"
          iconContainerClassName="bg-[#52DEE5]"
        />
      </div>
    </div>
  );
};

type ItemProps = {
  Icon: React.ComponentType<any>;
  name: string;
  value: string;
  iconContainerClassName?: string;
};

const Item: React.FC<ItemProps> = ({
  Icon,
  name,
  value,
  iconContainerClassName,
}) => {
  return (
    
      <div className="flex items-center rounded-full bg-background-800 p-2">
        <div className={classNames("p-2 rounded-full", iconContainerClassName)}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="px-4">{name}{value}</p>
      </div>
    
  );
};


export default webStats;
