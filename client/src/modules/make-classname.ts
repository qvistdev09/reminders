export const makeClassname = (...args: string[]) => {
  return args.filter(str => str !== '').join(' ');
};