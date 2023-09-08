import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import TextIcon from "@/components/shared/TextIcon";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { MediaSort } from "@/types/anilist";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo } from "react";
import { MobileView } from "react-device-detect";
import { useForm } from "react-hook-form";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { SEASON_YEARS } from "@/constants";
import List from "@/components/shared/List";
import Card from "@/components/shared/Card";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import InView from "@/components/shared/InView";
import Link from "next/link";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

const seasonYears = SEASON_YEARS.map((year) => ({ label: year, value: year }));

const initialValues: UseBrowseOptions = {
    format: undefined,
    keyword: "",
    genres: [],
    season: undefined,
    seasonYear: undefined,
    tags: [],
    sort: MediaSort.Trending_desc,
    country: undefined,
    isAdult: false,
  };
  
const ChooseTriviaPage = () => {

    const defaultValues = { ...initialValues };

  const {
    control,
    register,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<UseBrowseOptions>({
    defaultValues,
  });
  
    const { t } = useTranslation("trivia");

    const tabContainerRef = React.useRef<HTMLElement>(null);

    const handleTabSelect = () => {
        tabContainerRef.current.scrollTop = 0;
    };

    const query = watch();
    
    const {
        data,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isError,
      } = useBrowse(query);
    
      const handleFetch = () => {
        if (isFetchingNextPage || !hasNextPage) return;
    
        fetchNextPage();
      };

    const { SEASONS, STATUS, COUNTRIES } = useConstantTranslation();

    // states
    const handleGenresChange = useCallback(
        (values) => {
          values.forEach(({ type, value }) => {
            setValue(type === "TAGS" ? "tags" : "genres", value, {
              shouldDirty: true,
            });
          });
        },
        [setValue]
      );

        
    const totalData = useMemo(
        () => data?.pages.flatMap((el) => el.media),
        [data?.pages]
    )

    useEffect(() => {
        // limit # total data
        if (totalData && totalData.length > 52) {
            totalData.length = 52;
        }
    })

    return (
        <Section className="py-20">
            <Head
                title={t("choose_page_title")}
                description={t("choose_page_description ")}
            />

            <h1 className="text-4xl font-semibold mb-8">
                {t("choose_page_heading")}
            </h1>

            <Tabs
                domRef={(node) => (tabContainerRef.current = node)}
                onSelect={handleTabSelect}
                forceRenderTabPanel
                selectedTabClassName="bg-background-700 border-b border-primary-500"
                selectedTabPanelClassName="!block"
            >

                <div className="p-2 bg-background-800">
                    <TabList className="">
                        <div
                            className="flex items-center gap-2 overflow-x-scroll no-scrollbar"
                        >
                            <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                                Random
                            </Tab>
                            {/* <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                                PreMade
                            </Tab> */}
                            {/* <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                                Build my own
                            </Tab> */}
                        </div>
                    </TabList>
                </div>

                <div className="py-2 grow overflow-x-hidden no-scrollbar">
                    <TabPanel className="hidden h-full p-2">
                            <Section>
                                <form>
                                <div className="flex flex-col md:flex-row md:items-end gap-6 lg:flex-wrap lg:justify-between lg:space-x-0">
                                    <Input
                                        containerInputClassName="border border-white/80"
                                        label={t("room_name")}
                                    />
                                    <div className="snap-x overflow-x-auto flex items-center gap-4 md:gap-6 no-scrollbar overflow-y-auto">
                                        <GenresFormSelect
                                            value={[...query.genres, ...query.tags]}
                                            onChange={handleGenresChange}
                                        />

                                        <FormSelect
                                            control={control}
                                            name="seasonYear"
                                            defaultValue={defaultValues.seasonYear}
                                            selectProps={{
                                            placeholder: t("year"),
                                            options: seasonYears,
                                            }}
                                            label={t("year")}
                                        />

                                        <FormSelect
                                            control={control}
                                            name="season"
                                            defaultValue={defaultValues.season}
                                            selectProps={{
                                            placeholder: t("season"),
                                            options: SEASONS,
                                            }}
                                            label={t("season")}
                                        />

                                        <FormSelect
                                                control={control}
                                                name="country"
                                                defaultValue={defaultValues.country}
                                                selectProps={{
                                                placeholder: t("country"),
                                                options: COUNTRIES,
                                                }}
                                                label={t("country")}
                                            />

                                        <MobileView renderWithFragment>
                                            <FormSelect
                                                control={control}
                                                name="country"
                                                defaultValue={defaultValues.country}
                                                selectProps={{
                                                placeholder: t("country"),
                                                options: COUNTRIES,
                                                }}
                                                label={t("country")}
                                            />

                                            <FormSelect
                                                control={control}
                                                name="status"
                                                defaultValue={defaultValues.status}
                                                selectProps={{
                                                placeholder: t("status"),
                                                options: STATUS,
                                                }}
                                                label={t("status")}
                                            />
                                        </MobileView>
                                    </div>

                                    <Link href="/trivia/create/HASH#">
                                        <a>
                                            <Button primary>
                                                <p className="m-2 font-bold">Create</p>
                                            </Button>
                                        </a>
                                    </Link>
                                </div>
                                </form>
                                
                                <div className="mt-4 md:mt-8">
                                    {!isLoading && query ? (
                                    <React.Fragment>
                                        <List data={totalData}>{(data) => <Card data={data} />}</List>

                                        {isFetchingNextPage && !isError && (
                                        <div className="mt-4">
                                            <ListSkeleton />
                                        </div>
                                        )}

                                        {/* {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
                                            <InView onInView={handleFetch} />
                                        )} */}

                                        {!hasNextPage && !!totalData.length && (
                                        <p className="mt-8 text-2xl text-center">It&lsquo;s over...</p>
                                        )}
                                    </React.Fragment>
                                    ) : (
                                    <ListSkeleton />
                                    )}
                                </div>
                            </Section>
                    </TabPanel>

                    {/* <TabPanel className="hidden h-full p-2">

                    </TabPanel>

                    <TabPanel className="hidden h-full p-2">

                    </TabPanel> */}
                </div>
            </Tabs>

        </Section>
    )
}

export default ChooseTriviaPage;