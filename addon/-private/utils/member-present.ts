export default function memberPresent(obj, member) {
  return Object.prototype.hasOwnProperty.call(obj, member);
}
