import { Notification, NotificationEntity } from "@/types";
import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Musim Dingin" },
  { value: MediaSeason.Spring, label: "Musim Semi" },
  { value: MediaSeason.Summer, label: "Musim Panas" },
  { value: MediaSeason.Fall, label: "Musim Gugur" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Selesai" },
  { value: MediaStatus.Releasing, label: "Sedang Tayang" },
  { value: MediaStatus.Not_yet_released, label: "Belum Tayang" },
  { value: MediaStatus.Cancelled, label: "Dibatalkan" },
  { value: MediaStatus.Hiatus, label: "Hiatus" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "TV" },
  { value: MediaFormat.Tv_short, label: "TV Pendek" },
  { value: MediaFormat.Movie, label: "Film" },
  { value: MediaFormat.Special, label: "Spesial" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Musik" },
  { value: MediaFormat.Manga, label: "Manga" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularitas" },
  { value: MediaSort.Trending_desc, label: "Trending" },
  { value: MediaSort.Favourites_desc, label: "Favorit" },
  { value: MediaSort.Score_desc, label: "Skor Rata-rata" },
  { value: MediaSort.Updated_at_desc, label: "Baru Diperbarui" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularitas" },
  { value: MediaSort.Trending_desc, label: "Trending" },
  { value: MediaSort.Favourites_desc, label: "Favorit" },
  { value: MediaSort.Score_desc, label: "Skor Rata-rata" },
  { value: MediaSort.Updated_at_desc, label: "Baru Diperbarui" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Aksi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "Petualangan",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "Komedi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20464-HbmkPacki4sl.jpg",
  },
  {
    value: "Drama",
    label: "Drama",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n9253-JIhmKgBKsWUN.jpg",
  },
  {
    value: "Ecchi",
    label: "Ecchi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "Fantasi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/11757-TlEEV9weG4Ag.jpg",
  },
  {
    value: "Hentai",
    label: "Hentai",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/99894-MWIuMGnDIg1x.jpg",
  },
  {
    value: "Horror",
    label: "Horor",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/11111.jpg",
  },
  {
    value: "Mahou Shoujo",
    label: "Mahou Shoujo",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-d5M8NffgJJHB.jpg",
  },
  {
    value: "Mecha",
    label: "Mecha",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "Musik",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "Misteri",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "Psikologis",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "Romantis",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/44-C4I2Dy8MMyy0.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Sci-Fi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Slice of Life",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "Olahraga",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "Supranatural",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-Qx8bGsLXUgLo.jpg",
  },
  {
    value: "Thriller",
    label: "Thriller",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100388-CR4PUEz1Nzsl.jpg",
  },
];

export const TYPES = [
  {
    value: "anime",
    label: "Anime",
  },
  {
    value: "manga",
    label: "Manga",
  },
  {
    value: "characters",
    label: "Karakter",
  },
  {
    value: "voice_actors",
    label: "Pengisi Suara",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Jepang",
  },
  {
    value: "CN",
    label: "China",
  },
  {
    value: "KR",
    label: "Korea",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "Utama" },
  { value: CharacterRole.Supporting, label: "Pendukung" },
  { value: CharacterRole.Background, label: "Latar Belakang" },
];

export const WATCH_STATUS = [
  {
    value: "WATCHING",
    label: "Sedang Ditonton",
  },
  {
    value: "PLANNING",
    label: "Direncanakan",
  },
  {
    value: "COMPLETED",
    label: "Selesai",
  },
];

export const READ_STATUS = [
  {
    value: "READING",
    label: "Sedang Dibaca",
  },
  {
    value: "PLANNING",
    label: "Direncanakan",
  },
  {
    value: "COMPLETED",
    label: "Selesai",
  },
];

export const VISIBILITY_MODES = [
  {
    value: "public",
    label: "Publik",
  },
  {
    value: "private",
    label: "Pribadi",
  },
];

export const CHAT_EVENT_TYPES = {
  join: "telah bergabung dengan ruangan",
  leave: "telah meninggalkan ruangan",
  play: "telah memulai video",
  pause: "telah menghentikan video",
  changeEpisode: "telah mengubah episode",
};

export const GENDERS = {
  male: "Laki-laki",
  female: "Perempuan",
};

export const EMOJI_GROUP = {
  smileys_people: "Senyum & Orang",
  animals_nature: "Hewan & Alam",
  food_drink: "Makanan & Minuman",
  travel_places: "Perjalanan & Tempat",
  activities: "Aktivitas",
  objects: "Objek",
  symbols: "Simbol",
  flags: "Bendera",
  recently_used: "Baru Digunakan",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Putar ({{shortcut}})",
    pause: "Jeda ({{shortcut}})",
    forward: "Maju {{time}} detik",
    backward: "Mundur {{time}} detik",
    enableSubtitle: "Aktifkan subtitle",
    disableSubtitle: "Nonaktifkan subtitle",
    settings: "Pengaturan",
    enterFullscreen: "Masuk layar penuh ({{shortcut}})",
    exitFullscreen: "Keluar layar penuh ({{shortcut}})",
    muteVolume: "Bisukan ({{shortcut}})",
    unmuteVolume: "Bunyikan ({{shortcut}})",
    sliderDragMessage: "Geser untuk mencari video",
    nextEpisode: "Episode berikutnya",
    episodes: "Episode",
    skipOPED: "Lewati OP/ED",
    timestamps: "Timestamps",
    screenshot: "Screenshot",
  },
  settings: {
    audio: "Audio",
    playbackSpeed: "Kecepatan pemutaran",
    quality: "Kualitas",
    subtitle: "Subtitle",
    subtitleSettings: "Pengaturan subtitle",
    reset: "Reset",
    none: "Tidak ada",
    off: "Mati",
    subtitleBackgroundOpacity: "Keburaman Latar Belakang",
    subtitleFontOpacity: "Keburaman Teks",
    subtitleFontSize: "Ukuran Font",
    subtitleTextStyle: "Gaya Teks",
  },
};

export const NOTIFICATION_ENTITIES: Record<
  string,
  (notification: Notification) => NotificationEntity
> = {
  comment_mention: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.user_metadata?.name} menyebut Anda dalam komentar`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
  comment_reaction: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.user_metadata?.name} bereaksi pada komentar Anda`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
};

const DAYSOFWEEK = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const translations = {
  SEASONS,
  FORMATS,
  STATUS,
  GENRES,
  CHARACTERS_ROLES,
  ANIME_SORTS,
  MANGA_SORTS,
  TYPES,
  COUNTRIES,
  VISIBILITY_MODES,
  CHAT_EVENT_TYPES,
  WATCH_STATUS,
  READ_STATUS,
  GENDERS,
  EMOJI_GROUP,
  PLAYER_TRANSLATIONS,
  DAYSOFWEEK,
  NOTIFICATION_ENTITIES,
};

export default translations;
