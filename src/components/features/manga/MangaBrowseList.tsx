import AdvancedSettings from "@/components/shared/AdvancedSettings";
import Card from "@/components/shared/Card";
import FormSelect from "@/components/shared/FormSelect";
import GenresFormSelect from "@/components/shared/GenresFormSelect";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import SortSelector from "@/components/shared/SortSelector";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useBrowse, { UseBrowseOptions } from "@/hooks/useBrowseManga";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import { MediaSort } from "@/types/anilist";
import { debounce } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MobileView } from "react-device-detect";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineSearch } from "react-icons/ai";
import { FaSlidersH } from "react-icons/fa";

const initialValues: UseBrowseOptions = {
  format: undefined,
  keyword: "",
  genres: [],
  tags: [],
  sort: MediaSort.Trending_desc,
  country: undefined,
};

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({
  defaultQuery = initialValues,
}) => {
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

  const router = useRouter();
  const { FORMATS, STATUS, COUNTRIES } = useConstantTranslation();
  const { t } = useTranslation("common");
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

  const [isSettingsOpen, seSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end gap-6 lg:flex-wrap lg:justify-between lg:space-x-0">
         { <Input
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
          />}


      
          <div className="snap-x overflow-x-auto flex items-center gap-4 md:gap-6 no-scrollbar overflow-y-auto">
       {/*      <Input
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
              name="format"
              defaultValue={defaultValues.format}
              selectProps={{
                placeholder: t("format"),
                options: FORMATS,
              }}
              label={t("format")}
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
          </AdvancedSettings>
        </div>

        <div className={classNames("flex items-end justify-end", isSettingsOpen ? "block" : "hidden")}>
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

      <div className="mt-8">
        {!isLoading && query ? (
          <React.Fragment>
            <List data={totalData}>{(item) => <Card data={item} />}</List>

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
