import { consumerKey, consumerSecret } from '../secrets/twitter';
const rp = require('request-promise');

const twitterAPIUserTimelineEndpoint =
  'https://api.twitter.com/1.1/statuses/user_timeline.json';

export default async function fetchTwittermemo(
  twitterid: string,
  token: string,
  secret: string
) {
  let maxId = null;
  let memos: any[] = [];
  while (true) {
    const timeline: any[] = await fetchTwitterUserTimeline(
      twitterid,
      token,
      secret,
      maxId
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
  maxId: string | null
) {
  const count = 200;
  const data: any = {
    user_id: twitterId,
    count,
  };

  if (maxId) {
    data['max_id'] = maxId;
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
