import { shallowMount, createLocalVue } from '@vue/test-utils';
import MainTitle from '@/components/Top/MainTitle.vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import i18n from '@/i18n';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Vuetify);
localVue.use(VueI18n);

describe('Component', () => {
  test('is a Vue instance', () => {
    const store = new Vuex.Store({
      state: {
        theme: {
          themes: 'light',
        },
      },
    });
    const wrapper = shallowMount(MainTitle, { store, i18n, localVue });
    expect(wrapper.element).toMatchSnapshot();
  });
});
