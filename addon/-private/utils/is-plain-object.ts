export default function isPlainObject(obj) {
  return typeof obj === 'object'
    && obj !== null
    && (
      obj.constructor === Object || // {}
      obj.constructor === undefined // Object.create(null)
    );
}
