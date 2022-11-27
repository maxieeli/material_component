import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook } from '../../theme'

export interface ComponentToken {}

interface GapToken extends FullToken<'Gap'> {}

const genGapStyle: GenerateStyle<GapToken> = token => {
  const { componentCls } = token

  return {
    [componentCls]: {
      display: 'inline-flex',
      '&-vertical': {
        flexDirection: 'column',
      },
      '&-align': {
        flexDirection: 'column',
        '&-center': {
          alignItems: 'center',
        },
        '&-start': {
          alignItems: 'flex-start',
        },
        '&-end': {
          alignItems: 'flex-end',
        },
        '&-baseline': {
          alignItems: 'flex-baseline',
        },
      },
      [`${componentCls}-space-item`]: {
        '&:empty': {
          display: 'none',
        },
      },
    },
  }
}

// ============================== Export ==============================
export default genComponentStyleHook('Gap', token => [genGapStyle(token)])
