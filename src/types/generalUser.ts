import { UserState } from '@/store/modules/user';

export interface GeneralUser extends UserState {
  provider?: string;
}
