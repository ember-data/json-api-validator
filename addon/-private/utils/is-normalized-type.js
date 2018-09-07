import normalizeType from './normalize-type';

export default function isNormalized(type) {
  let normalized = normalizeType(type);

  return normalized === type;
}
