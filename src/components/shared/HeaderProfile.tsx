import Avatar from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import Popup from "@/components/shared/Popup";
import TextIcon from "@/components/shared/TextIcon";
import { useUser } from "@supabase/auth-helpers-react";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "next-i18next";
import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";


const HeaderProfile = () => {
  const { user } = useUser();
  const { t } = useTranslation("header");

  if (!user) return null;

  return (
    <Popup
      type="click"
      placement="bottom-start"
      offset={[3.5, 10]}
      showArrow
      reference={<Avatar src={user.user_metadata?.avatar_url} />}
    >
      <div className="flex items-center mb-3 md:mb-5 space-x-2">
        <Avatar src={user.user_metadata.avatar_url} className="!w-14 !h-14" />

        <div>
          <p className="font-semibold">
            {user.user_metadata.full_name || user.user_metadata.name}
          </p>
          <p className="text-gray-300 text-sm">{t("user")}</p>
        </div>
      </div>

      <div className="space-y-2">
       <div className="py-2">
       <Link href="/watchlist">
          <a>
            <Button className="w-full" primary>
              <TextIcon LeftIcon={AiFillHeart}>Watch List</TextIcon>
            </Button>
          </a>
        </Link>
       </div>
       {/*  <Link href="/upload">
          <a>
            <Button className="w-full" secondary>
              <TextIcon LeftIcon={AiOutlineHistory}>Continue Watching</TextIcon>
            </Button>
          </a>
        </Link> */}
        
        <Link href="/reviews/create">
          <a>
            <Button className="w-full" primary>
              <TextIcon LeftIcon={BsPencilFill}>Write a Review</TextIcon>
            </Button>
          </a>
        </Link>

        <Button
          secondary
          className="w-full"
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          <TextIcon LeftIcon={HiOutlineLogout}>
            <p>{t("logout")}</p>
          </TextIcon>
        </Button>
      </div>
    </Popup>
  );
};

export default React.memo(HeaderProfile);
