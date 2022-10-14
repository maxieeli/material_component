import { getStyle as getCheckboxStyle } from '../../Checkbox/styled'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook } from '../../theme'

export interface ComponentToken {
  controlWidth: number
  controlItemWidth: number
  dropdownHeight: number
}

type CascaderToken = FullToken<'Cascader'>

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<CascaderToken> = token => {
  const { prefixCls, componentCls, muiCls } = token
  const cascaderMenuItemCls = `${componentCls}-menu-item`
  const iconCls = `
    &${cascaderMenuItemCls}-expand ${cascaderMenuItemCls}-expand-icon,
    ${cascaderMenuItemCls}-loading-icon
  `

  const itemPaddingVertical = Math.round(
    (token.controlHeight - token.fontSize * token.lineHeight) / 2,
  )

  return [
    // Control
    {
      [componentCls]: {
        width: token.controlWidth,
      },
    },

    // Popup
    {
      [`${componentCls}-dropdown`]: [
        // ==================== Checkbox ====================
        getCheckboxStyle(`${prefixCls}-checkbox`, token),
        {
          [`&${muiCls}-select-dropdown`]: {
            padding: 0,
          },
        },
        {
          [componentCls]: {
            // ================== Checkbox ==================
            '&-checkbox': {
              top: 0,
              marginInlineEnd: token.paddingXS,
            },

            // ==================== Menu ====================
            // >>> Menus
            '&-menus': {
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'flex-start',

              [`&${componentCls}-menu-empty`]: {
                [`${componentCls}-menu`]: {
                  width: '100%',
                  height: 'auto',

                  [cascaderMenuItemCls]: {
                    color: token.colorTextDisabled,
                    cursor: 'default',
                    pointerEvents: 'none',
                  },
                },
              },
            },

            // >>> Menu
            '&-menu': {
              flexGrow: 1,
              minWidth: token.controlItemWidth,
              height: token.dropdownHeight,
              margin: `-${token.paddingXS}px 0`,
              padding: `${token.paddingXS}px 0`,
              overflow: 'auto',
              verticalAlign: 'top',
              listStyle: 'none',
              '&:not(:last-child)': {
                borderInlineEnd: `${token.controlLineWidth}px ${token.controlLineType} ${token.colorSplit}`,
              },

              '&-item': {
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                padding: `${itemPaddingVertical + 1}px ${token.paddingSM}px`, // 5 12 -> 6 12
                overflow: 'hidden',
                lineHeight: token.lineHeight,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast}`,
                borderRadius: token.radiusSM,

                '&:hover': {
                  background: token.controlItemBgHover,
                },
                ' &-disabled': {
                  color: token.colorTextDisabled,
                  cursor: 'not-allowed',

                  '&:hover': {
                    background: 'transparent',
                  },
                },

                [`&-active:not(${cascaderMenuItemCls}-disabled)`]: {
                  [`&, &:hover`]: {
                    fontWeight: token.fontWeightStrong,
                    backgroundColor: token.controlItemBgActive,
                  },
                },

                '&-content': {
                  flex: 'auto',
                },

                '&-keyword': {
                  color: token.colorHighlight,
                },
              },
            },
          },
        },
      ],
    },
  ]
}

// ============================== Export ==============================
export default genComponentStyleHook('Cascader', token => [genBaseStyle(token)], {
  controlWidth: 184,
  controlItemWidth: 111,
  dropdownHeight: 180,
})
