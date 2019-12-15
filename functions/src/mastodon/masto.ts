import Masto, { GatewayConstructorParams } from 'masto';
import { reject } from 'bluebird';

export default function masto(params: GatewayConstructorParams) {
  return Masto.login(params)
    .then((masto) => {
      return masto;
    })
    .catch((error) => {
      console.log(error);
      return reject('Instance not found');
    });
}
