import type { DropdownToken } from './index'
import type { GenerateStyle } from '../../theme'

const genButtonStyle: GenerateStyle<DropdownToken> = token => {
  const { componentCls, muiCls, paddingXS, opacityLoading } = token

  return {
    [`${componentCls}-button`]: {
      whiteSpace: 'nowrap',

      [`&${muiCls}-btn-group > ${muiCls}-btn`]: {
        [`&-loading, &-loading + ${muiCls}-btn`]: {
          cursor: 'default',
          pointerEvents: 'none',
          opacity: opacityLoading,
        },

        [`&:last-child:not(:first-child):not(${muiCls}-btn-icon-only)`]: {
          paddingInline: paddingXS,
        },
      },
    },
  }
}

export default genButtonStyle
