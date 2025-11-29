import Head from "@/components/shared/Head";
import { useTranslation } from "next-i18next";
import Section from "@/components/shared/Section";
import { GetStaticProps } from "next";
// REVALIDATE_TIME removed - using pure SSG
import { Review } from "@/types";
import ClientOnly from "@/components/shared/ClientOnly";
import NewestReviews from "@/components/shared/NewestReviews";
import { MediaType } from "@/types/anilist";

interface ReviewBrowseProps {
    reviews: Review[];
}

const ReviewPage: React.FC<ReviewBrowseProps> = ({ }) => {
    const { t } = useTranslation("review");

    return (
        <div className="py-20">
            <Head
            title={t("title")}
            description={t("description")}
            />

            <ClientOnly>

                <Section
                    title="Reviews"
                >
                   <NewestReviews  type={MediaType.Anime} homeView={false} />
                    
                </Section>
            </ClientOnly>

        </div>
    );
}

export const getStaticProps: GetStaticProps = async ({}) => {
    try {
        return {
            props: { },
        };
    } catch (error) {
        return { notFound: true}
    }
}
export default ReviewPage;