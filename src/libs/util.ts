// To be unique array's entity
export function uniq(array: Array<string>) {
  const knownElements = new Map();
  for (const elem of array) {
    knownElements.set(elem, true); // 同じキーに何度も値を設定しても問題ない
  }
  return Array.from(knownElements.keys());
}

export function generateUUID(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return crypto.subtle.digest('SHA-256', data).then((hash) => {
    return hex(hash);
  });
}

function hex(buffer: ArrayBuffer) {
  let digest = '';
  const view = new DataView(buffer);
  for (let i = 0; i < view.byteLength; i += 4) {
    const value = view.getUint32(i);
    const stringValue = value.toString(16);
    const padding = '00000000';
    const paddedValue = (padding + stringValue).slice(-padding.length);
    digest += paddedValue;
  }

  return digest;
}
