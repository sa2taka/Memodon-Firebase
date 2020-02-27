import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module,
} from 'vuex-module-decorators';
import store from '@/store/index';
import { Label } from '@/types/label';

export interface ILabels {
  labels: Label[];
}

@Module({ dynamic: true, store, name: 'labels', namespaced: true })
class Labels extends VuexModule implements ILabels {
  public labels: Label[] = [];

  @Mutation
  public setLabels(labels: Label[]) {
    this.labels = labels;
  }
}

const module = getModule(Labels);
export default module;
