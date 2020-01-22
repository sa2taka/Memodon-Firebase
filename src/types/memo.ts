import firebase from '@/firebase';

export type Memo = TwitterMemo | MastodonMemo;

export interface TwitterMemo extends MemoBase {
  entities: TwitterEntities;
  extendedEntities: TwitterExtendedEntities;
}

export interface MastodonMemo extends MemoBase {
  entities: MastodonEntities;
  visibility: string;
}

export interface MemoBase {
  id: number | string;
  provider: string;
  providerId: number | string;
  text: string;
  uid: string;
  user: firebase.firestore.DocumentReference;
  timestamp: firebase.firestore.Timestamp;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}

export interface TwitterEntities {
  hashtags: string[];
  media?: TwitterMedia;
  urls: TwitterURL[];
  user_mentions: TwitterUserMention[];
  symbols: TwitterSymbol[];
}

export interface TwitterExtendedEntities {
  media: TwitterMedia[];
}

export interface MastodonEntities {
  hashtags: string[];
  media: MastodonMedia[];
}

export interface TwitterSymbol extends TwitterEntityBase {
  text: string;
}

export interface TwitterURL extends TwitterEntityBase {
  display_url: string;
  expanded_url: string;
  url: string;
}

export interface TwitterMedia extends TwitterEntityBase {
  display_url: string;
  expanded_url: string;
  id: number;
  id_str: string;
  media_url: string;
  media_url_https: string;
  sizes: {
    thumb: TwitterMediaSize;
    large: TwitterMediaSize;
    medium: TwitterMediaSize;
    small: TwitterMediaSize;
  };
  type: string;
  url: string;
  video_info?: TwitterVideoInfo;
}

export interface TwitterUserMention extends TwitterEntityBase {
  name: string;
  screen_name: string;
  id: number;
  id_str: string;
}

export interface TwitterEntityBase {
  indices: number[];
}

export interface TwitterMediaSize {
  w: number;
  h: number;
  resize: string;
}

export interface TwitterVideoInfo {
  aspect_ratio: number[];
  duration_millis: number;
  variants: TwitterVariants[];
}

export interface TwitterVariants {
  bitrate: number;
  content_type: string;
  url: string;
}

export interface MastodonMedia {
  id: string;
  type: 'unknown' | 'image' | 'gifv' | 'video' | 'audio';
  url: string;
  preview_url: string;
  remote_url: string | null;
  text_url: string;
  meta: MastodonImageMetaData | MastodonVideoMetaData;
  description: string;
  blurhash: string;
}

export interface MastodonImageMetaData extends MastodonMediaMetaDataBase {
  focus: {
    x: number;
    y: number;
  };
}

export interface MastodonVideoMetaData
  extends MastodonGifvMetaData,
    MastodonAudioMetaData {}

export interface MastodonGifvMetaData
  extends MastodonMediaMetaDataBase,
    MastodonMediaSize {
  length: string;
  duration: number;
  fps: number;
}

export interface MastodonAudioMetaData extends MastodonMediaMetaDataBase {
  length: string;
  duration: number;
  audio_encode: string;
  audio_bitrate: string;
  audio_channels: string;
}

export interface MastodonMediaMetaDataBase {
  original: MastodonMediaSize;
  small: MastodonMediaSize;
}

export interface MastodonMediaSize {
  width: number;
  height: number;
  size: string;
  aspect: number;
  frame_rate?: string;
}

export function isMastodonMedia(media: any): media is MastodonMedia {
  return 'type' in media && 'url' in media && 'preview_url' in media;
}

export function isTwitterMedia(media: any): media is TwitterMedia {
  return 'display_url' in media && 'expanded_url' in media && 'id_str' in media;
}
