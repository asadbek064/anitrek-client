
import Card from "@/components/shared/Card";
import { Media } from "@/types/anilist";
import List from "@/components/shared/List";

interface AnimeWatchListProps {
    data: Media[];
}
const AnimeWatchList: React.FC<AnimeWatchListProps> = ({ data }) => {
    return (
        <List data={data}>{(data) => <Card data={data} watchList={true} />}</List>
    );
};


export default AnimeWatchList;