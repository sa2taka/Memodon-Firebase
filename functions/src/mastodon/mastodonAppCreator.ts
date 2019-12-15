import Masto from 'masto';
import appConfig from './appConfig';

export function createMastodonApp(masto: Masto) {
  return masto.createApp(appConfig);
}
