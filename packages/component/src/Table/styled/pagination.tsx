import type { CSSObject } from '@developerli/styled'
import type { GenerateStyle } from '../../theme'
import type { TableToken } from './index'

const genPaginationStyle: GenerateStyle<TableToken, CSSObject> = token => {
  const { componentCls, muiCls } = token
  return {
    [`${componentCls}-wrapper`]: {
      // ========================== Pagination ==========================
      [`${componentCls}-pagination${muiCls}-pagination`]: {
        margin: `${token.margin}px 0`,
      },

      [`${componentCls}-pagination`]: {
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: token.paddingXS,

        '> *': {
          flex: 'none',
        },

        '&-left': {
          justifyContent: 'flex-start',
        },

        '&-center': {
          justifyContent: 'center',
        },

        '&-right': {
          justifyContent: 'flex-end',
        },
      },
    },
  }
}

export default genPaginationStyle
