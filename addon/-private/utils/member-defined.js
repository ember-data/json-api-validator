import memberPresent from './member-present';

export default function memberDefined(obj, member) {
  return memberPresent(obj, member) && obj[member] !== undefined;
}
