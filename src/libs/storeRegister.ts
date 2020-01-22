import Theme from '@/store/modules/theme';
import User from '@/store/modules/user';

let storageEntity: any = null;
try {
  storageEntity = JSON.parse(localStorage.memodonState);
} catch (e) {
  storageEntity = null;
}

export default async function registerStore() {
  if (!storageEntity) {
    return;
  }

  setTheme();
  await setUser();
}

const setTheme = () => {
  Theme.setTheme(storageEntity.theme.theme);
};

const setUser = async () => {
  User.setInfo(storageEntity.user);
  await User.signIn();
};
