export const getModifier = (base: string, str?: string) => {
  return str ? `${base}--${str}` : '';
};
