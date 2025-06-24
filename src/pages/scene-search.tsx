import TraceImageSearch from "@/components/features/trace/TraceImageSearch";
import TracePanel from "@/components/features/trace/TracePanel";
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Loading from "@/components/shared/Loading";
import useTraceImage, { TraceImageResponse } from "@/hooks/useTraceImage";
import React, { useCallback, useState } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import { ImageType } from "react-images-uploading";
import { useTranslation } from "react-i18next";
import Section from "@/components/shared/Section";

const TracePage = () => {
  const [traceResult, setTraceResult] = useState<TraceImageResponse>(null);
  const [image, setImage] = useState<ImageType>(null);

  const { mutateAsync, isLoading } = useTraceImage();
  const [t] = useTranslation("trace");

  const handleOnSearch = useCallback(
    async (image: ImageType) => {
      setImage(image);

      const result = await mutateAsync(image);
    
      // filter out all adult titles from result
      const cleanResult = result.result.filter(title => {
        if (!title.anime.isAdult)
            return title;
      });
      
      result.result = cleanResult;
      
      setTraceResult(result);
    },
    [mutateAsync]
  );



  const handleReset = useCallback(() => {
    setTraceResult(null);
    setImage(null);
  }, []);

  return (
    <React.Fragment>
      <Head
        title={`${t("tab_title")} - AniTrek`}
        description={`${t("description")}`}
      />

      <Section className="pt-20 space-y-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">{t("heading")}</h1>

        {/*   <h3 className="text-lg mb-2">{t("description")}</h3> */}

          <p className="italic text-xs mb-1">
            {t("made_by")}{" "}
            <a
              className="text-primary-300 hover:underline"
              href="https://github.com/soruly/trace.moe"
            >
              trace.moe
            </a>
          </p>

          <p className="italic text-xs">{t("note")}</p>
        </div>

        {traceResult ? (
          <React.Fragment>
            <Button
              primary
              onClick={handleReset}
              LeftIcon={MdOutlineRestartAlt}
            >
              <p>{t("try_again")}</p>
            </Button>

            <TracePanel data={traceResult} image={image} />
          </React.Fragment>
        ) : isLoading ? (
          <div className="relative w-full md:w-1/3 flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.dataURL}
              alt="searched image"
              className="w-full object-fit blur-[2px] transition duration-200"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <Loading />
          </div>
        ) : (
          <TraceImageSearch onSearch={handleOnSearch} />
        )}
      </Section>
    </React.Fragment>
  );
};

export default TracePage;
