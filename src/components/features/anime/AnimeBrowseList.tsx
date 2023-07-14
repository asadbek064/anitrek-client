import AdvancedSettings from "@/components/shared/AdvancedSettings";
import Card from "@/components/shared/Card";
import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import SortSelector from "@/components/shared/SortSelector";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import { SEASON_YEARS } from "@/constants";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { MediaSort } from "@/types/anilist";
import { debounce } from "@/utils";
import { useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isMobile, MobileView } from "react-device-detect";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSlidersH } from "react-icons/fa";

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

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
}) => {
  const { t } = useTranslation("common");
  const defaultValues = { ...initialValues, ...defaultQuery };

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

  const { user } = useUser();
  const router = useRouter();
  const { FORMATS, SEASONS, STATUS, COUNTRIES } = useConstantTranslation();
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

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue("keyword", e.target.value),
    500
  );

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
  );

  useEffect(() => {
    if (!isDirty) return;

    // Reset isDirty to false
    reset(query);

    const truthyQuery = {};

    Object.keys(query).forEach((key) => {
      if (!query[key]) return;

      truthyQuery[key] = query[key];
    });

    router.replace({ query: truthyQuery, pathname: "/browse" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const [isSettingsOpen, seSettingsOpen] = useState(true);
<<<<<<< HEAD

=======
  const {user} =  useUser();
>>>>>>> 84482f3f367fbaa8677497f13ad070bd67b786e7
  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6 lg:flex-wrap lg:justify-between lg:space-x-0">
          {
            <Input
              {...register("keyword")}
              containerInputClassName="border border-white/80"
              LeftIcon={AiOutlineSearch}
              onChange={handleInputChange}
              defaultValue={defaultValues.keyword}
              label={t("search")}
              containerClassName="w-full shrink-0 md:px-32 lg:px-64"
              RightIcon={FaSlidersH}
              isSettingsOpen={isSettingsOpen}
              setSettingsOpen={seSettingsOpen}
            />
          }

          <div className="snap-x overflow-x-auto flex items-center gap-4 md:gap-6 no-scrollbar overflow-y-auto">
            {/*  <Input
              {...register("keyword")}
              containerInputClassName="border border-white/80"
              LeftIcon={AiOutlineSearch}
              onChange={handleInputChange}
              defaultValue={defaultValues.keyword}
              label={t("search")}
              containerClassName="hidden md:block shrink-0"
              RightIcon={FaSlidersH}
              isSettingsOpen={isSettingsOpen}
              setSettingsOpen={seSettingsOpen}
            /> */}

            <GenresFormSelect
              className={isSettingsOpen ? "block" : "hidden"}
              value={[...query.genres, ...query.tags]}
              onChange={handleGenresChange}
            />

            <FormSelect
              containerClassName={isSettingsOpen ? "block" : "hidden"}
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
              containerClassName={isSettingsOpen ? "block" : "hidden"}
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
              containerClassName={isSettingsOpen ? "block" : "hidden"}
              control={control}
              name="format"
              defaultValue={defaultValues.format}
              selectProps={{
                placeholder: t("format"),
                options: FORMATS,
              }}
              label={t("format")}
            />

            <MobileView renderWithFragment>
<<<<<<< HEAD
              <FormSelect
                containerClassName={isSettingsOpen ? "block" : "hidden"}
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
                containerClassName={isSettingsOpen ? "block" : "hidden"}
                control={control}
                name="status"
                defaultValue={defaultValues.status}
                selectProps={{
                  placeholder: t("status"),
                  options: STATUS,
                }}
                label={t("status")}
              />
              <div className="flex space-x-4 md:hidden">

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
            </div>

            <div className="flex items-center justify-center md:hidden">
              <input
                className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                type="checkbox"
                id="adultCheckbox"
                {...register("isAdult")}
              />
              <label
                className="inline-block text-white"
                htmlFor="adultCheckbox"
              >
                18+
              </label>
            </div>

=======
              <div className={isSettingsOpen ? "block" : "hidden"}>
                <div className="flex space-x-4">
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

                    <div className="flex items-center justify-center pt-8">
                    {user ? 
                    (
                      <div>
                        <input
                          className="appearance-none h-8 w-8  border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                          type="checkbox"
                          id="adultCheckbox"
                          {...register("isAdult")}
                        />
                        <label
                          className="inline-block text-white"
                          htmlFor="adultCheckbox"
                        >
                          18+
                        </label>
                      </div>
                    ) :
                    (
                      <div>
                        <input
                          className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                          type="checkbox"
                          id="adultCheckbox"
                          disabled
                        />
                        <label
                          className="inline-block text-white"
                          htmlFor="adultCheckbox"
                        >
                          18+ (Member only)
                        </label>
                      </div>
                    )  
                  }
                  </div>
                </div>

              </div>
>>>>>>> 84482f3f367fbaa8677497f13ad070bd67b786e7
            </MobileView>
          </div>

          <AdvancedSettings
            referenceClassName="hidden md:flex"
            className="space-y-4"
          >
            <div className="flex space-x-4">
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
            </div>

<<<<<<< HEAD
            <div className="flex items-center">
              {user ? 
                (
                <div>
                  <input
                    className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                    type="checkbox"
                    id="adultCheckbox"
                    {...register("isAdult")}
                  />
                  <label
                    className="inline-block text-white"
                    htmlFor="adultCheckbox"
                  >
                    18+
                  </label>  
                </div>
=======
            <div className="flex items-center justify-center">
              {user ? 
                (
                  <div>
                    <input
                      className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                      type="checkbox"
                      id="adultCheckbox"
                      {...register("isAdult")}
                    />
                    <label
                      className="inline-block text-white"
                      htmlFor="adultCheckbox"
                    >
                      18+
                    </label>
                  </div>
>>>>>>> 84482f3f367fbaa8677497f13ad070bd67b786e7
                ) :
                (
                  <div>
                    <input
                      className="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-gray-600 checked:bg-primary-500 checked:border-primary-500 focus:outline-none transition duration-200 mr-2 cursor-pointer"
                      type="checkbox"
                      id="adultCheckbox"
                      disabled
                    />
                    <label
                      className="inline-block text-white"
                      htmlFor="adultCheckbox"
                    >
<<<<<<< HEAD
                      18+ (members only)
                    </label>  
                  </div>
                )
              }

=======
                      18+ (Member only)
                    </label>
                  </div>
                )  
              }
>>>>>>> 84482f3f367fbaa8677497f13ad070bd67b786e7
            </div>
          </AdvancedSettings>
        </div>

        <div
          className={classNames(
            "flex items-end justify-end",
            isSettingsOpen ? "block" : "hidden"
          )}
        >
          <Controller
            name="sort"
            control={control}
            defaultValue={defaultQuery.sort}
            render={({ field: { value, onChange } }) => (
              <SortSelector
                type="anime"
                defaultValue={value}
                onChange={onChange}
              />
            )}
          />
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

            {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
              <InView onInView={handleFetch} />
            )}

            {!hasNextPage && !!totalData.length && (
              <p className="mt-8 text-2xl text-center">It&lsquo;s over...</p>
            )}
          </React.Fragment>
        ) : (
          <ListSkeleton />
        )}
      </div>
    </div>
  );
};

export default BrowseList;
