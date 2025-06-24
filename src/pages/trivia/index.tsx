import Head from "@/components/shared/Head";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { AiOutlinePlus } from "react-icons/ai";

const TriviaWithFriendPage = () => {
    const { t } = useTranslation("trivia");

    return (
        <div className="py-20">
            <Head
            title={t("title")}
            description={t("description")}
            />

            <div className="relative h-screen">

               {/*  <video
                    autoPlay
                    muted
                    loop
                    poster="https://cdn.discordapp.com/attachments/820893881980813314/1094571392512577566/poster-thumbnail.jpg"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
                >
                    <source  src="wallpapers/3s326y.mp4" type="video/mp4" />
                </video> */}
                <div className="flex flex-col justify-center items-center h-full relative z-10 mx-2">
                    <h2 className="text-center text-white text-3xl md:text-5xl font-bold mb-8">
                    {t("heading")}
                    </h2>
                    <p className="text-white text-center mb-8 max-w-lg">
                    Music quiz game that allows you to play online with
                    other players or your friends.
                    </p>
                    
                    <Button disabled={true} primary LeftIcon={AiOutlinePlus}>
                        <p className="md:text-[2rem] m-2 font-bold">Coming soon</p>
                    </Button>
                    {/* <Link href="/trivia/create">
                        <a>
                            <Button disabled={true} primary LeftIcon={AiOutlinePlus}>
                                <p className="md:text-[2rem] m-2 font-bold">{t("create_room")}</p>
                            </Button>
                        </a>
                    </Link> */}
                </div>
            </div>

        </div>
    )
}

export default TriviaWithFriendPage;