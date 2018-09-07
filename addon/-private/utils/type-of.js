export default function typeOf(value) {
  let type = typeof value;

  if (type === "object") {
    if (value instanceof Date) {
      type = "Date";
    } else if (value === null) {
      type = "Null";
    } else {
      type = value;
    }
  }

  return type;
}
