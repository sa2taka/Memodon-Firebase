import { config } from 'firebase-functions';

const redirectPath = '/auth/mastodon/code';
let redirect_uris: string = `https://memodon.com${redirectPath} https://memodon-js.web.app${redirectPath}`;

if (config().config.env === 'development') {
  redirect_uris = `http://localhost:8080${redirectPath} https://2e39dac909b0488b90756ddc00e7ca73.vfs.cloud9.ap-northeast-1.amazonaws.com${redirectPath}`;
}
const scope = 'read';

export const appConfig = {
  client_name: 'Memodon',
  redirect_uris,
  scopes: scope,
  website: 'https://memodon.com',
};
