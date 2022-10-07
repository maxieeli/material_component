import type { AliasToken, GenerateStyle } from '../../theme';
import type { TokenWithCommonCls } from '../../theme/utils/genComponentStyleHook';

const genCollapseMotion: GenerateStyle<TokenWithCommonCls<AliasToken>> = token => ({
  [token.componentCls]: {
    // For common/openAnimation
    [`${token.muiCls}-motion-collapse-legacy`]: {
      overflow: 'hidden',

      '&-active': {
        transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
      },
    },

    [`${token.muiCls}-motion-collapse`]: {
      overflow: 'hidden',
      transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`,
    },
  },
});

export default genCollapseMotion;
