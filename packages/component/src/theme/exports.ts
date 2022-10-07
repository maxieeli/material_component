import { useToken as useInternalToken, defaultConfig } from '.';
import defaultAlgorithm from './themes/default';
import darkAlgorithm from './themes/dark';

// Please do not export internal `useToken` directly to avoid something export unexpected.
function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}

export default {
  /** @private Test Usage. Do not use. */
  defaultConfig,

  useToken,
  defaultAlgorithm,
  darkAlgorithm,
};
