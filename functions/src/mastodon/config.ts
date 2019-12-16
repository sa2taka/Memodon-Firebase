const redirect_uris = 'urn:ietf:wg:oauth:2.0:oob';

const scope = 'read';

export const appConfig = {
  client_name: 'Memodon',
  redirect_uris,
  scopes: scope,
  website: 'https://memodon.com',
};

export const authorizeConfig = (clinet_id: string, client_secret: string) => {
  return {
    response_type: 'code',
    redirect_uris,
    scope,
    clinet_id,
    client_secret,
  };
};
