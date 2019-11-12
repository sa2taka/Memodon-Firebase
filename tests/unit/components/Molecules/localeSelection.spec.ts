import { shallowMount, createLocalVue } from '@vue/test-utils';
import localeSelection from '@/components/Molecules/localeSelection.vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import i18n from '@/i18n';
import VueI18n from 'vue-i18n';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Vuetify);
localVue.use(VueI18n);

describe('Component', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(localeSelection, { i18n, localVue });
  });

  it('is a Vue instance', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should set locale', () => {
    wrapper.vm.setLang('jp');
    expect(wrapper.vm.$i18n.locale).toBe('jp');
  });
});
