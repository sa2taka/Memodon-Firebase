import Masto from 'masto';
import { appConfig } from './config';

export function createMastodonApp(masto: Masto) {
  return masto.createApp(appConfig);
}
