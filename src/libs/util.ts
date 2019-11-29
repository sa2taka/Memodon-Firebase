// To be unique array's entity
export function uniq(array: Array<string>) {
  const knownElements = new Map();
  for (const elem of array) {
    knownElements.set(elem, true); // 同じキーに何度も値を設定しても問題ない
  }
  return Array.from(knownElements.keys());
}
