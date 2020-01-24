const ogpParser = require('ogp-parser');
const fromEntries = require('object.fromentries');
const entries = require('object.entries');

export default function fetchOgp(url: string) {
  return ogpParser(url, true)
    .then((result: any) => {
      const allowProperties = [
        'og:site_name',
        'og:title',
        'og:url',
        'og:image',
        'og:description',
      ];
      const ogps = entries(result.ogp)
        .filter((ogp: any) => allowProperties.includes(ogp[0]) && ogp[1])
        .map((ogp: any) => [ogp[0], ogp[1][0]]);
      return fromEntries(ogps);
    })
    .catch((e: Error) => {
      console.error(e, e.stack);
      throw e;
    });
}
