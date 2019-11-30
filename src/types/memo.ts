import firebase from '@/firebase';

export interface TwitterMemo extends Memo {
  entities: TwitterEntities;
  extendedEntities: TwitterExtendedEntities;
}

export interface Memo {
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
  hashtags: TwitterHashTag[];
  media?: TwitterMedia;
  urls: TwitterURL[];
  user_mentions: TwitterUserMention[];
  symbols: TwitterSymbol[];
}

interface TwitterExtendedEntities {
  media: TwitterMedia[];
}

interface TwitterHashTag extends TwitterEntityBase {
  text: string;
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
