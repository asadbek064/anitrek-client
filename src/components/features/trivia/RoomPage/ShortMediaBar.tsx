import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import TextIcon from "@/components/shared/TextIcon";
import { useRoomInfo } from "@/contexts/RoomContext";
import { numberWithCommas } from "@/utils";
import dayjs from "dayjs";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { AiOutlineUser } from "react-icons/ai";

const ShortMediaBar = () => {
  const { room, socket, basicRoomUser } = useRoomInfo();
  const { locale } = useRouter();
  const { t } = useTranslation("wwf");


  return (
    <div className="p-2">
      <div className="relative flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <DotList>
              <span className="text-lg font-medium text-gray-200">
                {room.hostUser.user_metadata.full_name ||
                  room.hostUser.user_metadata.name}
              </span>

              <span className="text-sm text-gray-300">
                {dayjs(new Date(room.created_at), { locale }).fromNow()}
              </span>
            </DotList>
          </div>
        </div>

        <TextIcon
          className="absolute top-0 right-0 text-primary-300"
          LeftIcon={AiOutlineUser}
        >
          <p>{numberWithCommas(room.users.length)}</p>
        </TextIcon>
      </div>
    </div>
  );
};

export default ShortMediaBar;
