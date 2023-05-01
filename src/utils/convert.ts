export const removeSpecialSymbol = (input: string): string => {
  const reg = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;

  return input.replace(reg, '');
};
