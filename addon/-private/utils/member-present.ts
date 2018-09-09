export default function memberPresent(obj: object, member: string) {
  return Object.prototype.hasOwnProperty.call(obj, member);
}
