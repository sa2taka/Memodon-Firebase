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
  userMentions: TwitterUserMention[];
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
  displayUrl: string;
  expandedUrl: string;
  url: string;
}

interface TwitterMedia extends TwitterEntityBase {
  displayUrl: string;
  expandedUrl: string;
  id: number;
  idStr: string;
  mediaUrl: string;
  mediaUrlHttps: string;
  sizes: {
    thumb: TwitterMediaSize;
    large: TwitterMediaSize;
    medium: TwitterMediaSize;
    small: TwitterMediaSize;
  };
  type: string;
  url: string;
  videoInfo?: TwitterVideoInfo;
}

interface TwitterUserMention extends TwitterEntityBase {
  name: string;
  screenName: string;
  id: number;
  idStr: string;
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
  aspectRatio: number[];
  durationMillis: number;
  variants: TwitterVariants[];
}

interface TwitterVariants {
  bitrate: number;
  contentType: string;
  url: string;
}
