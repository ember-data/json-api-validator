import memberDefined from './member-defined';

export default function memberDefinedAndNotNull(obj: object, member: string) {
  return memberDefined(obj, member) && obj[member] !== null;
}
