import memberDefined from './member-defined';

export default function memberDefinedAndNotNull(obj, member) {
  return memberDefined(obj, member) && obj[member] !== null;
}
