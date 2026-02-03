import type { PublicPath } from "wxt/browser";

export type SettingCategory = "Metrics" | "Content";

export interface Setting {
  key: string;
  label: string;
  tooltip: string;
  category: SettingCategory;
  cssFile: PublicPath;
}

export const settings = [
  {
    key: "hidecommentcount",
    label: "Hide Comment Count",
    tooltip: "Hides comment count.",
    category: "Metrics",
    cssFile: "/css/hide-commentcount.css",
  },
  {
    key: "hidecomments",
    label: "Hide Comments",
    tooltip: "Hides comments.",
    category: "Content",
    cssFile: "/css/hide-comments.css",
  },
  {
    key: "hideendscreen",
    label: "Hide End Screen",
    tooltip: "Hides content shown near and at the end of videos.",
    category: "Content",
    cssFile: "/css/hide-endscreen.css",
  },
  {
    key: "hidehomefeed",
    label: "Hide Home Feed",
    tooltip: "Hides Home feed.",
    category: "Content",
    cssFile: "/css/hide-homefeed.css",
  },
  {
    key: "hidelikecount",
    label: "Hide Like Count",
    tooltip: "Hides like count.",
    category: "Metrics",
    cssFile: "/css/hide-likecount.css",
  },
  {
    key: "hidemembervideos",
    label: "Hide Member Videos",
    tooltip: "Hides Member videos.",
    category: "Content",
    cssFile: "/css/hide-membervideos.css",
  },
  {
    key: "hidemixes",
    label: "Hide Mixes",
    tooltip: "Hides Mixes.",
    category: "Content",
    cssFile: "/css/hide-mixes.css",
  },
  {
    key: "hideplayables",
    label: "Hide Playables",
    tooltip: "Hides Playables.",
    category: "Content",
    cssFile: "/css/hide-playables.css",
  },
  {
    key: "hiderelatedvideos",
    label: "Hide Related Videos",
    tooltip: "Hides videos shown around the currently playing video.",
    category: "Content",
    cssFile: "/css/hide-relatedvideos.css",
  },
  {
    key: "hideshorts",
    label: "Hide Shorts",
    tooltip: "Hides Shorts.",
    category: "Content",
    cssFile: "/css/hide-shorts.css",
  },
  {
    key: "hidesubscribercount",
    label: "Hide Subscriber Count",
    tooltip: "Hides subscriber count.",
    category: "Metrics",
    cssFile: "/css/hide-subscribercount.css",
  },
  {
    key: "hideuploaddate",
    label: "Hide Upload Date",
    tooltip: "Hides upload date.",
    category: "Metrics",
    cssFile: "/css/hide-uploaddate.css",
  },
  {
    key: "hidevideoduration",
    label: "Hide Video Duration",
    tooltip: "Hides video duration.",
    category: "Metrics",
    cssFile: "/css/hide-videoduration.css",
  },
  {
    key: "hideviewcount",
    label: "Hide View Count",
    tooltip: "Hides view, watching, and waiting count.",
    category: "Metrics",
    cssFile: "/css/hide-viewcount.css",
  },
] as const;

export type SettingId = (typeof settings)[number]["key"];
