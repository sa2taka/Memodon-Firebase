import { consumerKey, consumerSecret } from '../secrets/twitter';
import { firestore } from 'firebase-admin';

const rp = require('request-promise');
const moment = require('moment');

const twitterAPIUserTimelineEndpoint =
  'https://api.twitter.com/1.1/statuses/user_timeline.json';

export default function fetchTwitterMemo(
  twitterId: string,
  token: string,
  secret: string,
  sinceId?: string
) {
  return crawlAndFilterTimeline(twitterId, token, secret, sinceId).then(
    (timeline) => {
      const newNoteForUser = timeline.map((value) => {
        return {
          id: value.id,
          timestamp: firestore.Timestamp.fromMillis(
            moment(value.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('x')
          ),
          text: value.text,
          entities: value.entities,
          provider: 'twitter.com',
          providerId: twitterId,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };
      });

      return newNoteForUser;
    }
  );
}

async function crawlAndFilterTimeline(
  twitterid: string,
  token: string,
  secret: string,
  sinceId?: string
) {
  let maxId = null;
  let memos: any[] = [];
  while (true) {
    const timeline: any[] = await fetchTwitterUserTimeline(
      twitterid,
      token,
      secret,
      maxId,
      sinceId
    );
    maxId = timeline[timeline.length - 1]
      ? timeline[timeline.length - 1].id
      : maxId;

    memos = memos.concat(
      timeline.filter((tweet: any) => {
        return (
          tweet.text.includes('#メモ') ||
          tweet.text.toLowerCase().includes('#memo')
        );
      })
    );
    if (timeline.length < 1) {
      break;
    }

    await sleep(1500);
  }
  return memos;
}

function fetchTwitterUserTimeline(
  twitterId: string,
  token: string,
  secret: string,
  maxId: string | null,
  sinceId: string | undefined
) {
  const count = 200;
  const data: any = {
    user_id: twitterId,
    count,
  };

  if (maxId) {
    data['max_id'] = maxId;
  }

  if (typeof sinceId !== 'undefined') {
    data['since_id'] = sinceId;
  }

  return get(twitterAPIUserTimelineEndpoint, token, secret, data);
}

function get(url: string, token: string, tokenSecret: string, qs: any) {
  return rp({
    method: 'GET',
    uri: url,
    timeout: 30 * 1000,
    oauth: {
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      token,
      token_secret: tokenSecret,
    },
    json: true,
    qs,
  }).catch((error: any) => {
    console.error(error);
    throw error;
  });
}

const sleep = async (t: number) => {
  return await new Promise((r) => {
    setTimeout(() => {
      r();
    }, t);
  });
};
