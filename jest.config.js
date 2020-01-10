module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/unit/jestSetup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/router/index.ts',
    '!src/plugins/*.ts',
    '!src/*.{ts,vue}',
    '!src/registerServiceWorker.ts',
    '!src/libs/signinWithTwitter.ts',
    '!src/libs/mastodonUser.ts',
    '!src/libs/MoleCules/SigninTwitterButton.vue',
    '!src/views/*.{ts,vue}',
  ],
};
