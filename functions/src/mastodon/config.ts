import { config } from 'firebase-functions';

let redirect_uris: string | string[] = 'https://memodon.com';

if (config().config.env === 'development') {
  redirect_uris = [
    'http://localhost:8080, https://2e39dac909b0488b90756ddc00e7ca73.vfs.cloud9.ap-northeast-1.amazonaws.com/',
  ];
}
const scope = 'read';

export const appConfig = {
  client_name: 'Memodon',
  redirect_uris,
  scopes: scope,
  website: 'https://memodon.com',
};
