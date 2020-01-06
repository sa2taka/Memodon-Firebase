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

interface TwitterEntities {
  hashtags: string[];
  media?: TwitterMedia;
  urls: TwitterURL[];
  user_mentions: TwitterUserMention[];
  symbols: TwitterSymbol[];
}

interface TwitterExtendedEntities {
  media: TwitterMedia[];
}

interface MastodonEntities {
  hashtags: string[];
  media: MastodonMedia[];
}

interface TwitterSymbol extends TwitterEntityBase {
  text: string;
}

interface TwitterURL extends TwitterEntityBase {
  display_url: string;
  expanded_url: string;
  url: string;
}

interface TwitterMedia extends TwitterEntityBase {
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

interface TwitterUserMention extends TwitterEntityBase {
  name: string;
  screen_name: string;
  id: number;
  id_str: string;
}

interface TwitterEntityBase {
  indices: number[];
}

interface TwitterMediaSize {
  w: number;
  h: number;
  resize: string;
}

interface TwitterVideoInfo {
  aspect_ratio: number[];
  duration_millis: number;
  variants: TwitterVariants[];
}

interface TwitterVariants {
  bitrate: number;
  content_type: string;
  url: string;
}

interface MastodonMedia {
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

interface MastodonImageMetaData extends MastodonMediaMetaDataBase {
  focus: {
    x: number;
    y: number;
  };
}

interface MastodonVideoMetaData
  extends MastodonGifvMetaData,
    MastodonAudioMetaData {}

interface MastodonGifvMetaData
  extends MastodonMediaMetaDataBase,
    MastodonMediaSize {
  length: string;
  duration: number;
  fps: number;
}

interface MastodonAudioMetaData extends MastodonMediaMetaDataBase {
  length: string;
  duration: number;
  audio_encode: string;
  audio_bitrate: string;
  audio_channels: string;
}

interface MastodonMediaMetaDataBase {
  original: MastodonMediaSize;
  small: MastodonMediaSize;
}

interface MastodonMediaSize {
  width: number;
  height: number;
  size: string;
  aspect: number;
  frame_rate?: string;
}
