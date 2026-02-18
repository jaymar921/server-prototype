export const parseAccount = (old, newAcc) => {
  for (const prop of newAcc) {
    old[prop] = newAcc[prop];
  }

  return old;
};
