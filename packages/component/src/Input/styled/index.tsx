import type { CSSObject } from '@developerli/styled'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'
import type { GlobalToken } from '../../theme/interface'
import { clearFix, resetComponent } from '../../style'

export type InputToken<T extends GlobalToken = FullToken<'Input'>> = T & {
  inputAffixPadding: number
  inputPaddingVertical: number
  inputPaddingVerticalLG: number
  inputPaddingVerticalSM: number
  inputPaddingHorizontal: number
  inputPaddingHorizontalSM: number
  inputBorderHoverColor: string
  inputBorderActiveColor: string
}

export const genPlaceholderStyle = (color: string): CSSObject => ({
  // Firefox
  '&::-moz-placeholder': {
    opacity: 1,
  },
  '&::placeholder': {
    color,
    userSelect: 'none',
  },
  '&:placeholder-shown': {
    textOverflow: 'ellipsis',
  },
})

export const genHoverStyle = (token: InputToken): CSSObject => ({
  borderColor: token.inputBorderHoverColor,
  borderInlineEndWidth: token.controlLineWidth,
})

const genInputLargeStyle = (token: InputToken): CSSObject => {
  const {
    inputPaddingVerticalLG, inputPaddingHorizontal,
    fontSizeLG, controlRadiusLG,
  } = token
  return {
    padding: `${inputPaddingVerticalLG}px ${inputPaddingHorizontal}px`,
    fontSize: fontSizeLG,
    borderRadius: controlRadiusLG,
  }
}

export const genInputSmallStyle = (token: InputToken): CSSObject => ({
  padding: `${token.inputPaddingVerticalSM}px ${token.controlPaddingHorizontalSM - 1}px`,
  borderRadius: token.controlRadiusSM,
})

export const genInputGroupStyle = (token: InputToken): CSSObject => {
  const { prefixCls, componentCls, muiCls } = token

  return {
    position: 'relative',
    display: 'table',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,

    [`${componentCls}-wrapper`]: {
      boxSizing: 'border-box',
      margin: 0,
      padding: '2px 0',
      color: '#000000d9',
      fontSize: token.fontSize,
      position: 'relative',
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      paddingInlineStart: 2,
      paddingInlineEnd: 2,
      borderRadius: 4,
    },

    [`.${prefixCls}-group`]: {
      [`&-addon, &-wrap`]: {
        display: 'table-cell',
        width: 1,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',

        '&:not(:first-child):not(:last-child)': {
          borderRadius: 0,
        },
      },

      '&-wrap > *': {
        display: 'block !important',
      },

      '&-addon': {
        position: 'relative',
        padding: `0 ${token.inputPaddingHorizontal}px`,
        color: token.colorText,
        fontWeight: '400',
        fontSize: token.fontSize,
        textAlign: 'center',
        backgroundColor: token.colorFillAlter,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 0,
        transition: `all ${token.motionDurationSlow}`,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        height: `${token.controlHeight + 4}px`, // 36
        lineHeight: `${token.controlHeight + 4}px`,
        width: 'auto',
      },

      '&-addon:first-child': {
        borderInlineEnd: 0,
      },

      '&-addon:last-child': {
        borderInlineStart: 0,
      },
    },

    [`.${prefixCls}`]: {
      float: 'left',
      width: '100%',
      marginBottom: 0,
      textAlign: 'inherit',
      borderRadius: 0,
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,

      '&:focus': {
        zIndex: 1,
        borderInlineEndWidth: 1,
      },

      '&:hover': {
        zIndex: 1,
        borderInlineEndWidth: 1,

        [`.${prefixCls}-search-with-button &`]: {
          zIndex: 0,
        },
      },
    },

    // Reset rounded corners
    [`> .${prefixCls}:first-child, .${prefixCls}-group-addon:first-child`]: {
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,
    },

    [`> .${prefixCls}-affix-wrapper`]: {
      [`&:not(:first-child) .${prefixCls}`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
      },

      [`&:not(:last-child) .${prefixCls}`]: {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
      },
    },

    [`> .${prefixCls}:last-child, .${prefixCls}-group-addon:last-child`]: {
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,
    },

    [`.${prefixCls}-affix-wrapper`]: {
      '&:not(:last-child)': {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
        [`.${prefixCls}-search &`]: {
          borderStartStartRadius: token.controlRadius,
          borderEndStartRadius: token.controlRadius,
        },
      },

      [`&:not(:first-child), .${prefixCls}-search &:not(:first-child)`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
      },
    },

    '&&-compact': {
      display: 'block',
      ...clearFix(),

      [`.${prefixCls}-group-addon, .${prefixCls}-group-wrap, > .${prefixCls}`]: {
        '&:not(:first-child):not(:last-child)': {
          borderInlineEndWidth: token.controlLineWidth,

          '&:hover': {
            zIndex: 1,
          },

          '&:focus': {
            zIndex: 1,
          },
        },
      },

      '& > *': {
        display: 'inline-block',
        float: 'none',
        verticalAlign: 'top',
        borderRadius: 0,
      },

      [`& > .${prefixCls}-affix-wrapper`]: {
        display: 'inline-flex',
      },

      [`& > ${muiCls}-picker-range`]: {
        display: 'inline-flex',
      },

      '& > *:not(:last-child)': {
        marginInlineEnd: -token.controlLineWidth,
        borderInlineEndWidth: token.controlLineWidth,
      },

      // Undo float for
      [`.${prefixCls}`]: {
        float: 'none',
      },
    },
  }
}

const genGroupStyle = (token: InputToken): CSSObject => {
  const {
    prefixCls, componentCls,
    colorError, colorSuccess,
  } = token
  return {
    [`${componentCls}-group-wrapper`]: {
      display: 'inline-block',
      width: '100%',
      textAlign: 'center',
      verticalAlign: 'top',
      ...genInputGroupStyle(token),
      '&-status-error': {
        [`.${prefixCls}-group-addon`]: {
          color: colorError,
          borderColor: colorError,
        },
      },
      '&-status-warning': {
        [`.${prefixCls}-group-addon`]: {
          color: colorSuccess,
          borderColor: colorSuccess,
        },
      },
    }
  }
}

export const genActiveStyle = (token: InputToken) => ({
  borderColor: token.inputBorderHoverColor,
  borderInlineEndWidth: token.controlLineWidth,
  outline: 0,
})

const genStatusLabelStyle = (token: InputToken): CSSObject => {
  const { prefixCls } = token
  return {
    [`.${prefixCls}-label-error`]: {
      color: token.colorError,
    },
    [`.${prefixCls}-label-warning`]: {
      color: token.colorWarning,
    },
  }
}

const genActiveLabelStyle = (token: InputToken): CSSObject => {
  const { prefixCls } = token
  return {
    [`.${prefixCls}-text-outlined:hover`]: {
      borderColor: token.colorPrimaryText,
    },
    [`.${prefixCls}-outlined`]: {
      borderColor: token.colorPrimaryText,
      borderWidth: 2,
      color: token.colorPrimaryText,
    },
    [`.${prefixCls}-label`]: {
      padding: '0 5px',
      transform: 'translate(14px -8px) scale(0.75)',
      pointerEvents: 'none',
      userSelect: 'none',
      color: token.colorPrimaryText,
      top: '-2px',
    },
    [`.${prefixCls}-affix-wrapper`]: {
      '&::-webkit-input-placeholder': {
        color: 'inherit',
      },
      '&::-moz-input-placeholder': {
        color: 'inherit',
      },
      'input:placeholder': {
        color: 'inherit',
      },
    },
    ...genStatusLabelStyle(token),
  }
}

export const genDisabledStyle = (token: InputToken): CSSObject => ({
  color: token.colorTextDisabled,
  backgroundColor: token.colorBgContainerDisabled,
  borderColor: token.colorBorder,
  boxShadow: 'none',
  cursor: 'not-allowed',
  opacity: 1,

  '&:hover': {
    ...genHoverStyle(mergeToken<InputToken>(token, { inputBorderHoverColor: token.colorBorder })),
  },
})

export const genHasLabelStyle = (token: InputToken): CSSObject => {
  return {
    'input::-webkit-input-placeholder': {
      color: 'transparent',
    },
    'input::-moz-input-placeholder': {
      color: 'transparent',
    },
    'input:placeholder': {
      color: 'transparent',
    },
  }
}

export const genFocusedStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token
  return {
    [`${componentCls}-focused`]: {
      ...genActiveStyle(token),
      ...genActiveLabelStyle(token),
    }
  }
}

export const genStatusStyle = (token: InputToken): CSSObject => {
  const {
    prefixCls,
    colorError,
    colorWarning,
    colorErrorOutline,
    colorWarningOutline,
    colorErrorBorderHover,
    colorWarningBorderHover,
  } = token

  return {
    '&-status-error:not(&-disabled):not(&-borderless)&': {
      borderColor: colorError,

      '&:hover': {
        borderColor: colorErrorBorderHover,
      },

      '&:focus, &-focused': {
        ...genActiveStyle(
          mergeToken<InputToken>(token, {
            inputBorderActiveColor: colorError,
            inputBorderHoverColor: colorError,
            controlOutline: colorErrorOutline,
          }),
        ),
      },

      [`.${prefixCls}-prefix`]: {
        color: colorError,
      },
      [`.${prefixCls}-outlined`]: {
        borderColor: colorError,
        borderWidth: 2,
      },
      [`.${prefixCls}-suffix`]: {
        color: colorError,
      },
    },
    '&-status-warning:not(&-disabled):not(&-borderless)&': {
      borderColor: colorWarning,
      '&, &:hover': {
        borderColor: colorWarningBorderHover,
      },

      '&:focus, &-focused': {
        ...genActiveStyle(
          mergeToken<InputToken>(token, {
            inputBorderActiveColor: colorWarning,
            inputBorderHoverColor: colorWarning,
            controlOutline: colorWarningOutline,
          }),
        ),
      },

      [`.${prefixCls}-prefix`]: {
        color: colorWarning,
      },
      [`.${prefixCls}-outlined`]: {
        borderColor: colorWarning,
        borderWidth: 2,
      },
      [`.${prefixCls}-suffix`]: {
        color: colorWarning,
      },
    },
  }
}

const genAffixStyle = (token: InputToken): CSSObject => {
  const {
    prefixCls,
    inputAffixPadding,
    colorTextDescription,
  } = token

  return {
    [`.${prefixCls}-affix-wrapper`]: {
      ...genBasicInputStyle(token),
      display: 'inline-flex',
      borderRadius: token.radiusBase * 2,
      padding: `${token.inputPaddingVertical * 2}px ${token.inputPaddingHorizontal}px`,

      '&:not(&-disabled):hover': {
        ...genHoverStyle(token),
        zIndex: 1,
        [`.${prefixCls}-search-with-button &`]: {
          zIndex: 0,
        },
      },

      '&-focused, &:focus': {
        zIndex: 1,
      },

      '&-disabled': {
        [`.${prefixCls}[disabled]`]: {
          background: 'transparent',
        },
      },

      [`> input.${prefixCls}`]: {
        padding: 0,
        fontSize: 'inherit',
        border: 'none',
        outline: 'none',

        '&:focus': {
          boxShadow: 'none !important',
        },
      },

      '&::before': {
        width: 0,
        visibility: 'hidden',
        content: '"\\a0"',
      },

      [`.${prefixCls}`]: {
        '&-prefix, &-suffix': {
          display: 'flex',
          flex: 'none',
          alignItems: 'center',

          '> *:not(:last-child)': {
            marginInlineEnd: token.paddingXS,
          },
        },

        '&-show-count-suffix': {
          color: colorTextDescription,
        },

        '&-show-count-has-suffix': {
          marginInlineEnd: token.paddingXXS,
        },

        '&-prefix': {
          marginInlineEnd: inputAffixPadding,
        },

        '&-suffix': {
          marginInlineStart: inputAffixPadding,
        },
      },
      ...genAllowClearStyle(token),
      ...genStatusLabelStyle(token),
      '&::-webkit-input-placeholder': {
        color: 'transparent',
      },
      '&::-moz-input-placeholder': {
        color: 'transparent',
      },
      'input:placeholder': {
        color: 'transparent',
      },
    },
  }
}

// outlined
export const genOutlinedStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [`${componentCls}-outlined`]: {
        textAlign: 'left',
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: '-5px',
        left: 0,
        margin: 0,
        padding: '0 8px',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        borderStyle: 'solid',
        borderWidth: 1,
        overflow: 'hidden',
        minWidth: '0%',
        borderColor: 'rgba(0, 0, 0, 0.23)',
        'legend': {
          float: 'unset',
          overflow: 'hidden',
          display: 'block',
          width: 'auto',
          padding: 0,
          height: '11px',
          fontSize: '0.75em',
          visibility: 'hidden',
          maxWidth: '0.01px',
          transition: `max-width 50ms cubic-bezier(0.0. 0, 0.2, 1) 0ms;`,
          whiteSpace: 'nowrap',
          'span': {
            paddingLeft: 5,
            paddingRight: 5,
            display: 'inline-block',
            opacity: 0,
            visibility: 'visible',
          },
        },
      }
    }
  }
}

// input shrink
export const genShrinkStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token
  return {
    [`${componentCls}-shrink`]: {
      [`${componentCls}-outlined > legend`]: {
        maxWidth: '100%',
      },
      ...genActiveLabelStyle(token),
      ...genGroupStyle(token),
    }
  }
}

// text outlined
export const genTextOutlinedStyle = (token: InputToken): CSSObject => {
  const { prefixCls, componentCls } = token
  return {
    [`${componentCls}-text-outlined`]: {
      display: 'inline-flex',
      flexDirection: 'column',
      position: 'relative',
      minWidth: 0,
      padding: 0,
      margin: 0,
      border: 0,
      verticalAlign: 'top',
      width: '100%',
      borderRadius: token.radiusBase * 2, // 4
      [`.${prefixCls}-label`]: {
        color: token.colorTextSecondary,
        letterSpacing: '0.00938em',
        padding: 0,
        display: 'block',
        transformOrigin: 'top left',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: `calc(100% - ${token.controlHeightSM}px)`,
        position: 'absolute',
        left: '-3px', // 5 -> 3
        top: '-6px',
        transform: 'translate(14px 16px) scale(1)',
        transition: `
          color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,
          transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,
          max-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
        `,
        zIndex: token.zIndexBase,
        pointerEvents: 'none',
      },
      ...genOutlinedStyle(token),
      ...genAffixStyle(token),
      ...genStatusLabelStyle(token),
    }
  }
}

export const genBasicInputStyle = (token: InputToken): CSSObject => ({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  minWidth: 0,
  // padding: `${token.inputPaddingVertical}px ${token.inputPaddingHorizontal}px`,
  // 9 11
  padding: `${token.inputPaddingVertical * 2 + 1}px ${token.inputPaddingHorizontal}px`,
  color: token.colorText,
  fontSize: token.fontSize,
  // lineHeight: token.lineHeight,
  backgroundColor: token.colorBgContainer,
  backgroundImage: 'none',
  borderRadius: token.controlRadius,
  transition: `all ${token.motionDurationFast}`,
  border: 'none',
  outline: 'none',
  ...genPlaceholderStyle(token.colorTextPlaceholder),

  '&:hover': {
    ...genHoverStyle(token),
  },

  '&:focus, &-focused': {
    ...genActiveStyle(token),
  },

  '&-disabled, &[disabled]': {
    ...genDisabledStyle(token),
  },

  // Reset height for `textarea`s
  'textarea&': {
    maxWidth: '100%', // prevent textearea resize from coming out of its container
    height: 'auto',
    minHeight: token.controlHeight,
    lineHeight: token.lineHeight,
    verticalAlign: 'bottom',
    transition: `all ${token.motionDurationSlow}, height 0s`,
  },

  // Size
  '&-lg': {
    ...genInputLargeStyle(token),
  },
  '&-sm': {
    ...genInputSmallStyle(token),
  },
})

const genInputStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { prefixCls, controlHeightSM, controlLineWidth } = token

  const FIXED_CHROME_COLOR_HEIGHT = 16
  const colorSmallPadding =
    (controlHeightSM - controlLineWidth * 2 - FIXED_CHROME_COLOR_HEIGHT) / 2

  return {
    [`.${prefixCls}`]: {
      ...resetComponent(token),
      ...genBasicInputStyle(token),
      ...genStatusStyle(token),

      '&[type="color"]': {
        height: token.controlHeight,

        [`&.${prefixCls}-lg`]: {
          height: token.controlHeightLG,
        },
        [`&.${prefixCls}-sm`]: {
          height: controlHeightSM,
          paddingTop: colorSmallPadding,
          paddingBottom: colorSmallPadding,
        },
      },
    },
  }
}

const genAllowClearStyle = (token: InputToken): CSSObject => {
  const { prefixCls } = token
  return {
    // ========================= Input =========================
    [`.${prefixCls}-clear-icon`]: {
      margin: 0,
      color: token.colorIcon,
      fontSize: token.fontSizeIcon,
      verticalAlign: -1,
      cursor: 'pointer',
      lineHeight: 0,
      transition: `color ${token.motionDurationSlow}`,

      '&:hover': {
        color: token.colorTextDescription,
      },

      '&:active': {
        color: token.colorText,
      },

      '&-hidden': {
        visibility: 'hidden',
      },

      '&-has-suffix': {
        margin: `0 ${token.inputAffixPadding}px`,
      },
    },

    // ======================= TextArea ========================
    '&-textarea-with-clear-btn': {
      padding: '0 !important',
      border: '0 !important',

      [`.${prefixCls}-clear-icon`]: {
        position: 'absolute',
        insetBlockStart: token.paddingXS,
        insetInlineEnd: token.paddingXS,
        zIndex: 1,
      },
    },
  }
}

const genSearchInputStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { prefixCls, muiCls } = token
  const searchPrefixCls = `.${prefixCls}-search`
  return {
    [searchPrefixCls]: {
      [`.${prefixCls}`]: {
        '&:hover, &:focus': {
          borderColor: token.colorPrimaryHover,
          [`+ .${prefixCls}-group-addon ${searchPrefixCls}-button`]: {
            borderInlineStartColor: token.colorPrimaryHover,
          },
        },
      },

      [`.${prefixCls}-affix-wrapper`]: {
        borderRadius: 0,
      },

      [`.${prefixCls}-lg`]: {
        lineHeight: token.lineHeight - 0.0002,
      },

      [`> .${prefixCls}-group`]: {
        [`> .${prefixCls}-group-addon:last-child`]: {
          insetInlineStart: -1,
          padding: 0,
          border: 0,

          [`${searchPrefixCls}-button`]: {
            paddingTop: 0,
            paddingBottom: 0,
            borderStartStartRadius: 0,
            borderStartEndRadius: token.controlRadius,
            borderEndEndRadius: token.controlRadius,
            borderEndStartRadius: 0,
          },

          [`${searchPrefixCls}-button:not(${muiCls}-btn-primary)`]: {
            color: token.colorTextDescription,

            '&:hover': {
              color: token.colorPrimaryHover,
            },

            '&:active': {
              color: token.colorPrimaryActive,
            },

            [`&${muiCls}-btn-loading::before`]: {
              insetInlineStart: 0,
              insetInlineEnd: 0,
              insetBlockStart: 0,
              insetBlockEnd: 0,
            },
          },
        },
      },

      [`${searchPrefixCls}-button`]: {
        height: token.controlHeight,

        '&:hover, &:focus': {
          zIndex: 1,
        },
      },

      [`&-large ${searchPrefixCls}-button`]: {
        height: token.controlHeightLG,
      },

      [`&-small ${searchPrefixCls}-button`]: {
        height: token.controlHeightSM,
      },
    },
  }
}

export function initInputToken<T extends GlobalToken = GlobalToken>(token: T): InputToken<T> {
  // @ts-ignore
  return mergeToken<InputToken<T>>(token, {
    inputAffixPadding: token.paddingXXS,
    inputPaddingVertical: Math.max(
      Math.round(((token.controlHeight - token.fontSize * token.lineHeight) / 2) * 10) / 10 -
        token.controlLineWidth,
      3,
    ),
    inputPaddingVerticalLG:
      Math.ceil(((token.controlHeightLG - token.fontSizeLG * token.lineHeight) / 2) * 10) / 10 -
      token.controlLineWidth,
    inputPaddingVerticalSM: Math.max(
      Math.round(((token.controlHeightSM - token.fontSize * token.lineHeight) / 2) * 10) / 10 -
        token.controlLineWidth,
      0,
    ),
    inputPaddingHorizontal: token.controlPaddingHorizontal - token.controlLineWidth,
    inputPaddingHorizontalSM: token.controlPaddingHorizontalSM - token.controlLineWidth,
    inputBorderHoverColor: token.colorPrimaryHover,
    inputBorderActiveColor: token.colorPrimaryHover,
  })
}

const genTextAreaStyle: GenerateStyle<InputToken> = token => {
  const { prefixCls, inputPaddingHorizontal, paddingLG } = token
  const textareaPrefixCls = `.${prefixCls}-textarea`

  return {
    [textareaPrefixCls]: {
      position: 'relative',

      [`${textareaPrefixCls}-suffix`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: inputPaddingHorizontal,
        bottom: 0,
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        margin: 'auto',
      },

      [`&-status-error,
        &-status-warning,
        &-status-success,
        &-status-validating`]: {
        [`&${textareaPrefixCls}-has-feedback`]: {
          [`.${prefixCls}`]: {
            paddingInlineEnd: paddingLG,
          },
        },
      },

      '&-show-count': {
        [`> .${prefixCls}`]: {
          height: '100%',
        },

        '&::after': {
          position: 'absolute',
          bottom: 0,
          insetInlineEnd: 0,
          color: token.colorTextDescription,
          whiteSpace: 'nowrap',
          content: 'attr(data-count)',
          pointerEvents: 'none',
          display: 'block',
          transform: 'translateY(100%)',
        },
      },
    },
  }
}

// ============================== Export ==============================
export default genComponentStyleHook('Input', token => {
  const inputToken = initInputToken<FullToken<'Input'>>(token)

  return [
    genInputStyle(inputToken),
    genAffixStyle(inputToken),
    genSearchInputStyle(inputToken),
    genTextOutlinedStyle(inputToken),
    genHasLabelStyle(inputToken),
    genShrinkStyle(inputToken),
    genFocusedStyle(inputToken),
    genTextAreaStyle(inputToken),
    genGroupStyle(inputToken),
  ]
})
