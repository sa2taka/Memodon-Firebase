const openUrl = '/auth/';
const windowName = 'authWithMastodon';
const windowSize = 'width=640,height=480';

export function openAuthWithMastodonWindow() {
  const win = window.open('/auth/mastodon', windowName, windowSize); //=> 新しいウィンドウがポップアップ
  // console.log(win); //=> ウィンドウオブジェクト
  // win.close(); //openで作成したウィンドウオブジェクトはcloseが可能
}
