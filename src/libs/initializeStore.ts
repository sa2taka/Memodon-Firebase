import Theme from '@/store/modules/theme';

let storage: any;
try {
  storage = JSON.parse(localStorage.memodonState);
} catch (e) {
  storage = null;
}

const initializeStore = () => {
  if (!storage) {
    return;
  }

  setTheme();
};

const setTheme = () => {
  Theme.setTheme(storage.theme.theme);
};

export default initializeStore;
