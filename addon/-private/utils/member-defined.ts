import memberPresent from './member-present';

import { IObject } from 'ember-data';

export default function memberDefined(obj: IObject, member: string) {
  return memberPresent(obj, member) && obj[member] !== undefined;
}
