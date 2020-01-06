import { firestore } from 'firebase-admin';
import masto from '../mastodon/masto';
import Masto, { Status, FetchTimelineParams } from 'masto';

const moment = require('moment');

export default function fetchTwitterMemo(
  uri: string,
  providerId: string,
  accessToken: string,
  sinceId?: string
) {
  const hostname = new URL(uri).hostname;
  const searchTags = ['メモ', 'memo'].map((tag) => encodeURIComponent(tag));
  return masto({ uri, accessToken }).then((instance) => {
    return Promise.all(
      searchTags.map((tag) => {
        return crawlAndFilterTimeline(instance, tag, providerId, sinceId).then(
          (timeline) => {
            return timeline.map((value) => {
              const text = value.spoiler_text + value.content;
              const entities = {
                media: value.media_attachments,
                tags: value.tags,
              };
              return {
                id: value.id,
                timestamp: firestore.Timestamp.fromMillis(
                  moment(value.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format(
                    'x'
                  )
                ),
                text,
                entities,
                provider: hostname,
                providerId,
                visibility: value.visibility,
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
              };
            });
          }
        );
      })
    ).then((timelines) => {
      return flat(timelines).sort((a, b) => {
        return a.timestamp.toDate() < b.timestamp.toDate() ? 1 : -1;
      });
    });
  });
}

async function crawlAndFilterTimeline(
  instance: Masto,
  searchTag: string,
  providerId: string,
  sinceId?: string
) {
  let maxId = undefined;
  let memos: Status[] = [];
  while (true) {
    const timeline: any[] = await fetchMastodonTagTimeline(
      instance,
      searchTag,
      sinceId,
      maxId
    );
    maxId = timeline[timeline.length - 1]
      ? timeline[timeline.length - 1].id
      : maxId;

    console.log();

    memos = memos.concat(
      timeline.filter((tweet: any) => {
        return tweet.account.id === providerId;
      })
    );
    if (timeline.length < 1) {
      break;
    }

    await sleep(1500);
  }
  return memos;
}

function fetchMastodonTagTimeline(
  instance: Masto,
  searchTag: string,
  sinceId?: string,
  maxId?: string
) {
  const local = true;
  const limit = 40;
  return fetchTagTimeline(instance, searchTag, {
    local,
    limit,
    since_id: sinceId,
    max_id: maxId,
  });
}

function fetchTagTimeline(
  instance: Masto,
  id: string,
  params?: FetchTimelineParams
) {
  return instance.get<Status[]>(`/api/v1/timelines/tag/${id}`, params);
}

const sleep = async (t: number) => {
  return await new Promise((r) => {
    setTimeout(() => {
      r();
    }, t);
  });
};

const flat = (ary: any[]) => {
  return Array.prototype.concat.apply([], ary);
};
