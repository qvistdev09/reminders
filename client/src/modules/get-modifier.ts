export const getModifier = (base: string, str?: string, pre?: string) => {
  if (pre) {
    return str ? `${base}--${pre}-${str}` : '';
  }
  return str ? `${base}--${str}` : '';
};
