import Masto, { GatewayConstructorParams } from 'masto';
import { reject } from 'bluebird';

export default function masto(params: GatewayConstructorParams) {
  const masto = new Masto(params);

  return masto
    .fetchInstance()
    .then((_) => {
      return masto;
    })
    .catch((error) => {
      console.log(error);
      return reject('Instance not found');
    });
}
