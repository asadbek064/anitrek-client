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
  { value: MediaSeason.Winter, label: "冬季" },
  { value: MediaSeason.Spring, label: "春季" },
  { value: MediaSeason.Summer, label: "夏季" },
  { value: MediaSeason.Fall, label: "秋季" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "已完结" },
  { value: MediaStatus.Releasing, label: "连载中" },
  { value: MediaStatus.Not_yet_released, label: "未播出" },
  { value: MediaStatus.Cancelled, label: "已取消" },
  { value: MediaStatus.Hiatus, label: "暂停" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "电视剧" },
  { value: MediaFormat.Tv_short, label: "短篇电视剧" },
  { value: MediaFormat.Movie, label: "电影" },
  { value: MediaFormat.Special, label: "特别篇" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "网络放送" },
  { value: MediaFormat.Music, label: "音乐" },
  { value: MediaFormat.Manga, label: "漫画" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "人气" },
  { value: MediaSort.Trending_desc, label: "趋势" },
  { value: MediaSort.Favourites_desc, label: "收藏数" },
  { value: MediaSort.Score_desc, label: "评分" },
  { value: MediaSort.Updated_at_desc, label: "最近更新" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "人气" },
  { value: MediaSort.Trending_desc, label: "趋势" },
  { value: MediaSort.Favourites_desc, label: "收藏数" },
  { value: MediaSort.Score_desc, label: "评分" },
  { value: MediaSort.Updated_at_desc, label: "最近更新" },
];

export const GENRES = [
  {
    value: "Action",
    label: "动作",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "冒险",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "喜剧",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20464-HbmkPacki4sl.jpg",
  },
  {
    value: "Drama",
    label: "剧情",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n9253-JIhmKgBKsWUN.jpg",
  },
  {
    value: "Ecchi",
    label: "轻度色情",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "奇幻",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/11757-TlEEV9weG4Ag.jpg",
  },
  {
    value: "Horror",
    label: "恐怖",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/11111.jpg",
  },
  {
    value: "Mahou Shoujo",
    label: "魔法少女",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-d5M8NffgJJHB.jpg",
  },
  {
    value: "Mecha",
    label: "机甲",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "音乐",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "悬疑",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "心理",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "爱情",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/44-C4I2Dy8MMyy0.jpg",
  },
  {
    value: "Sci-Fi",
    label: "科幻",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "日常",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "体育",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "超自然",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-Qx8bGsLXUgLo.jpg",
  },
  {
    value: "Thriller",
    label: "惊悚",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100388-CR4PUEz1Nzsl.jpg",
  },
];

export const TYPES = [
  {
    value: "anime",
    label: "动漫",
  },
  {
    value: "manga",
    label: "漫画",
  },
  {
    value: "characters",
    label: "角色",
  },
  {
    value: "voice_actors",
    label: "声优",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "日本",
  },
  {
    value: "CN",
    label: "中国",
  },
  {
    value: "KR",
    label: "韩国",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "主要角色" },
  { value: CharacterRole.Supporting, label: "配角" },
  { value: CharacterRole.Background, label: "背景角色" },
];

export const WATCH_STATUS = [
  {
    value: "WATCHING",
    label: "正在观看",
  },
  {
    value: "PLANNING",
    label: "计划中",
  },
  {
    value: "COMPLETED",
    label: "已完成",
  },
];

export const READ_STATUS = [
  {
    value: "READING",
    label: "正在阅读",
  },
  {
    value: "PLANNING",
    label: "计划中",
  },
  {
    value: "COMPLETED",
    label: "已完成",
  },
];

export const VISIBILITY_MODES = [
  {
    value: "public",
    label: "公开",
  },
  {
    value: "private",
    label: "私密",
  },
];

export const CHAT_EVENT_TYPES = {
  join: "加入了房间",
  leave: "离开了房间",
  play: "开始播放视频",
  pause: "暂停了视频",
  changeEpisode: "切换了集数",
};

export const GENDERS = {
  male: "男性",
  female: "女性",
};

export const EMOJI_GROUP = {
  smileys_people: "笑脸与人物",
  animals_nature: "动物与自然",
  food_drink: "食物与饮料",
  travel_places: "旅行与地点",
  activities: "活动",
  objects: "物品",
  symbols: "符号",
  flags: "国旗",
  recently_used: "最近使用",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "播放 ({{shortcut}})",
    pause: "暂停 ({{shortcut}})",
    forward: "前进 {{time}} 秒",
    backward: "后退 {{time}} 秒",
    enableSubtitle: "启用字幕",
    disableSubtitle: "禁用字幕",
    settings: "设置",
    enterFullscreen: "进入全屏 ({{shortcut}})",
    exitFullscreen: "退出全屏 ({{shortcut}})",
    muteVolume: "静音 ({{shortcut}})",
    unmuteVolume: "取消静音 ({{shortcut}})",
    sliderDragMessage: "拖动以调整视频",
    nextEpisode: "下一集",
    episodes: "集数",
    skipOPED: "跳过 OP/ED",
    timestamps: "时间戳",
    screenshot: "截图",
  },
  settings: {
    audio: "音频",
    playbackSpeed: "播放速度",
    quality: "画质",
    subtitle: "字幕",
    subtitleSettings: "字幕设置",
    reset: "重置",
    none: "无",
    off: "关闭",
    subtitleBackgroundOpacity: "背景透明度",
    subtitleFontOpacity: "字体透明度",
    subtitleFontSize: "字体大小",
    subtitleTextStyle: "文字样式",
  },
};

export const NOTIFICATION_ENTITIES: Record<
  string,
  (notification: Notification) => NotificationEntity
> = {
  comment_mention: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.user_metadata?.name} 在评论中提到了您`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
  comment_reaction: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.user_metadata?.name} 对您的评论做出了反应`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
};

const DAYSOFWEEK = ["日", "一", "二", "三", "四", "五", "六"];

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
