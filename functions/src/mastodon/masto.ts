import Masto, { GatewayConstructorParams } from 'masto';

export default function masto(params: GatewayConstructorParams) {
  return Masto.login(params)
    .then((instance) => {
      return instance;
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject('Instance not found');
    });
}
