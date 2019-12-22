import Vue from 'vue';
import VueRouter, { Route, RawLocation, NavigationGuard } from 'vue-router';
import firebase from '../firebase';

import Top from '../views/Top.vue';
import Note from '../views/NotePage.vue';
import Settings from '../views/Settings.vue';
import AuthWithMastodon from '../views/AuthWithMastodon.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'top',
    component: Top,
    meta: { guest: true },
  },
  {
    path: '/note',
    name: 'note',
    component: Note,
    meta: { auth: true },
  },
  {
    path: '/setting',
    name: 'setting',
    component: Settings,
    meta: { auth: true },
  },
  {
    path: '/setting#account',
    name: 'setting-account',
    component: Settings,
    meta: { auth: true },
  },
  {
    path: '/setting#users',
    name: 'setting-users',
    component: Settings,
    meta: { auth: true },
  },
  {
    path: '/setting#tags',
    name: 'setting-tags',
    component: Settings,
    meta: { auth: true },
  },
  {
    path: '/auth/mastodon',
    name: 'authWithMastodon',
    component: AuthWithMastodon,
    meta: { auth: true },
  },
];

const beforeEach: NavigationGuard<Vue> = (
  to: Route,
  from: Route,
  next: (to?: any) => any
) => {
  const auth = to.matched.some((record: any) => {
    return record.meta.auth;
  });

  const guest = to.matched.some((record: any) => {
    return record.meta.guest;
  });

  if (!auth && !guest) {
    next();
    return;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user && auth) {
      next();
    } else if (user && guest) {
      next({
        path: '/note',
      });
    } else if (!user && guest) {
      next();
    } else if (!user && auth) {
      next({
        path: '/',
      });
    }
  });
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(beforeEach);

export default router;
