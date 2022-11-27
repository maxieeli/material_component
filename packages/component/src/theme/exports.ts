import { defaultConfig, useToken as useInternalToken } from '.'
import defaultAlgorithm from './themes/default'
import darkAlgorithm from './themes/dark'

function useToken() {
  const [theme, token, hashId] = useInternalToken()

  return { theme, token, hashId }
}

export default {
  /** @private Test Usage. Do not use in production. */
  defaultConfig,

  /** Default seedToken */
  defaultSeed: defaultConfig.token,

  useToken,
  defaultAlgorithm,
  darkAlgorithm,
}
