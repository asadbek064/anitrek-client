import React from "react";
import UploadContainer from "@/components/features/upload/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import CircleButton from "@/components/shared/CircleButton";
import Description from "@/components/shared/Description";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import ServerPaginateTable from "@/components/shared/ServerPaginateTable";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import useUploadedMedia, {
  getUploadedMedia,
  MediaWithMediaUnit,
} from "@/hooks/useUploadedMedia";
import { AdditionalUser, Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { getTitle } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { Column } from "react-table";
import Button from "@/components/shared/Button";

interface UploadAnimePageProps {
  user: AdditionalUser;
  sourceId: string;
}

const columns: Column<MediaWithMediaUnit<MediaType.Anime>>[] = [
  {
    Header: "Photo",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;
      const title = getTitle(originalCell);

      return (
        <div className="p-2">
          <PlainCard src={originalCell.coverImage.extraLarge} alt={title} />
        </div>
      );
    },
    accessor: "coverImage",
  },
  {
    Header: "Name",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      const title = getTitle(originalCell);

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5">{title}</p>
        </div>
      );
    },
    accessor: "title",
  },
  {
    Header: "Content",
    accessor: "description",
    Cell: ({ cell }) => {
      return (
        <div className="px-6 py-4">
          <Description
            className="line-clamp-5 overflow-hidden text-white"
            description={cell.value}
          />
        </div>
      );
    },
  },
  {
    Header: "Episode posted",
    accessor: "episodes",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">
            {originalCell.totalUploadedEpisodes || 0}/{cell.value || "??"}
          </p>
        </div>
      );
    },
  },
  {
    Header: "Act",
    Cell: ({ cell }) => {
      return (
        <div className="w-full flex items-center justify-center">
          <Link href={`/upload/anime/${cell.value}`}>
            <a>
              <CircleButton secondary LeftIcon={AiOutlineEdit} />
            </a>
          </Link>
        </div>
      );
    },
    accessor: "id",
  },
];

const UploadAnimePage: NextPage<UploadAnimePageProps> = ({
  user,
  sourceId,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useUploadedMedia({
    type: MediaType.Anime,
    page: pageIndex + 1,
    perPage: pageSize,
    sourceId,
  });

  useEffect(() => {
    const options = {
      type: MediaType.Anime,
      page: pageIndex + 2,
      perPage: pageSize,
      sourceId,
    };

    queryClient.prefetchQuery(["uploaded-media", { options }], () =>
      getUploadedMedia(options)
    );
  }, [pageIndex, pageSize, queryClient, sourceId]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handlePageIndexChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <UploadContainer
      title="List of Uploaded Anime"
      isVerified={user.isVerified}
    >
      <Button primary className="absolute -top-2 right-4 md:right-12">
        <Link href="/upload/anime/create">
          <a>Tìm anime</a>
        </Link>
      </Button>

      {isLoading ? (
        <Loading />
      ) : data?.media?.length ? (
        <ServerPaginateTable
          data={data.media}
          columns={columns}
          totalCount={data.total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onPageIndexChange={handlePageIndexChange}
        />
      ) : (
        <h1 className="text-3xl text-center">Bạn chưa đăng Anime nào</h1>
      )}
    </UploadContainer>
  );
};

export default UploadAnimePage;

export const getServerSideProps = withAdditionalUser({
  async getServerSideProps(_, user) {
    try {
      const { data: sourceAddedByUser, error } = await supabaseClient
        .from<Source>("kaguya_sources")
        .select("id")
        .eq("addedUserId", user.id)
        .single();

      if (error || !sourceAddedByUser?.id) {
        throw error;
      }

      return {
        props: {
          sourceId: sourceAddedByUser.id,
        },
      };
    } catch (err) {
      return {
        redirect: {
          statusCode: 302,
          destination: "/login",
        },
      };
    }
  },
});

// @ts-ignore
UploadAnimePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
