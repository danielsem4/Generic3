type ClearAuthFn = () => void;
let _clearAuth: ClearAuthFn | null = null;

export const storeRegistry = {
  register: (fn: ClearAuthFn): void => {
    _clearAuth = fn;
  },
  clearAuth: (): void => {
    _clearAuth?.();
  },
};
