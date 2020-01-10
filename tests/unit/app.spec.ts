import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import Router from 'vue-router';
import App from '@/App.vue';

describe('App.vue', () => {
  const localVue = createLocalVue();
  let wrapper: any;
  let store: any;

  beforeAll(() => {
    localVue.use(Vuetify, {});
    localVue.use(Router);
    localVue.use(Vuex);
  });

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        theme: {
          themes: 'light',
        },
      },
    });
    wrapper = shallowMount(App, { store, localVue, vuetify: new Vuetify() });
  });

  it('should become dark mode', () => {
    const updateThemeMock = jest.fn();
    wrapper.setMethods({
      updateTheme: updateThemeMock,
    });
    wrapper.vm.$data.isDark = true;

    expect(updateThemeMock).toBeCalled();
  });
});
