import { getArrowOffset } from '../../style/placementArrow'
import {
  initMoveMotion,
  initSlideMotion,
  slideDownIn,
  slideDownOut,
  slideUpIn,
  slideUpOut,
} from '../../style/motion'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'
import genButtonStyle from './button'
import genStatusStyle from './status'
import { genFocusStyle, resetComponent, roundedArrow } from '../../style'

export interface ComponentToken {
  zIndexPopup: number
}

export interface DropdownToken extends FullToken<'Dropdown'> {
  rootPrefixCls: string
  dropdownArrowDistance: number
  dropdownArrowOffset: number
  dropdownPaddingVertical: number
  dropdownEdgeChildPadding: number
  menuCls: string
}

// =============================== Base ===============================
const genBaseStyle: GenerateStyle<DropdownToken> = token => {
  const {
    componentCls,
    menuCls,
    zIndexPopup,
    dropdownArrowDistance,
    dropdownArrowOffset,
    sizePopupArrow,
    muiCls,
    iconCls,
    motionDurationMid,
    motionDurationFast,
    dropdownPaddingVertical,
    fontSizeBase,
    dropdownEdgeChildPadding,
    radiusBase,
    colorTextDisabled,
    fontSizeIcon,
    controlPaddingHorizontal,
    colorBgElevated,
    boxShadowPopoverArrow,
  } = token

  return [
    {
      [componentCls]: {
        ...resetComponent(token),

        position: 'absolute',
        top: -9999,
        left: {
          _skip_check_: true,
          value: -9999,
        },
        zIndex: zIndexPopup,
        display: 'block',
        borderRadius: token.radiusBase * 2,
        outline: 0,
        boxShadow: token.boxShadow,
        transition: 'box-shadow .3s cubic-bezier(.4, 0, .2, 1) 0ms',
        '&::before': {
          position: 'absolute',
          insetBlock: -dropdownArrowDistance + sizePopupArrow,
          zIndex: -9999,
          opacity: 0.0001,
          content: '""',
        },

        [`${componentCls}-wrap`]: {
          position: 'relative',

          [`${muiCls}-btn > svg`]: {
            fontSize: fontSizeIcon,
          },
        },

        [`${componentCls}-wrap-open`]: {
          [`${iconCls}-down::before`]: {
            transform: `rotate(180deg)`,
          },
        },

        [`
          &-hidden,
          &-menu-hidden,
          &-menu-submenu-hidden
        `]: {
          display: 'none',
        },

        // Arrow
        [`
        &-show-arrow&-placement-topLeft,
        &-show-arrow&-placement-top,
        &-show-arrow&-placement-topRight
      `]: {
          paddingBottom: dropdownArrowDistance,
        },

        [`
        &-show-arrow&-placement-bottomLeft,
        &-show-arrow&-placement-bottom,
        &-show-arrow&-placement-bottomRight
      `]: {
          paddingTop: dropdownArrowDistance,
        },

        [`${componentCls}-arrow`]: {
          position: 'absolute',
          zIndex: 1,
          display: 'block',
          width: sizePopupArrow,
          height: sizePopupArrow,

          ...roundedArrow(
            sizePopupArrow,
            token.radiusXS,
            token.radiusOuter,
            colorBgElevated,
            boxShadowPopoverArrow,
          ),
        },

        [`
        &-placement-top > ${componentCls}-arrow,
        &-placement-topLeft > ${componentCls}-arrow,
        &-placement-topRight > ${componentCls}-arrow
      `]: {
          bottom: dropdownArrowDistance,
          boxShadow: token.boxShadowPopoverArrow,
          transform: 'rotate(45deg)',
        },

        [`&-placement-top > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: 'translateX(-50%) rotate(45deg)',
        },

        [`&-placement-topLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-topRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`
          &-placement-bottom > ${componentCls}-arrow,
          &-placement-bottomLeft > ${componentCls}-arrow,
          &-placement-bottomRight > ${componentCls}-arrow
        `]: {
          top: dropdownArrowDistance,
          transform: `rotate(-135deg) translateY(-0.5px)`,
        },

        [`&-placement-bottom > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: '50%',
          },
          transform: `translateX(-50%) rotate(-135deg) translateY(-0.5px)`,
        },

        [`&-placement-bottomLeft > ${componentCls}-arrow`]: {
          left: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        [`&-placement-bottomRight > ${componentCls}-arrow`]: {
          right: {
            _skip_check_: true,
            value: dropdownArrowOffset,
          },
        },

        // animation motion
        [`&${muiCls}-slide-down-enter${muiCls}-slide-down-enter-active&-placement-bottomLeft,
          &${muiCls}-slide-down-appear${muiCls}-slide-down-appear-active&-placement-bottomLeft
          &${muiCls}-slide-down-enter${muiCls}-slide-down-enter-active&-placement-bottom,
          &${muiCls}-slide-down-appear${muiCls}-slide-down-appear-active&-placement-bottom,
          &${muiCls}-slide-down-enter${muiCls}-slide-down-enter-active&-placement-bottomRight,
          &${muiCls}-slide-down-appear${muiCls}-slide-down-appear-active&-placement-bottomRight`]: {
          animationName: slideUpIn,
        },

        [`&${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-topLeft,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-topLeft,
          &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-top,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-top,
          &${muiCls}-slide-up-enter${muiCls}-slide-up-enter-active&-placement-topRight,
          &${muiCls}-slide-up-appear${muiCls}-slide-up-appear-active&-placement-topRight`]: {
          animationName: slideDownIn,
        },

        [`&${muiCls}-slide-down-leave${muiCls}-slide-down-leave-active&-placement-bottomLeft,
          &${muiCls}-slide-down-leave${muiCls}-slide-down-leave-active&-placement-bottom,
          &${muiCls}-slide-down-leave${muiCls}-slide-down-leave-active&-placement-bottomRight`]: {
          animationName: slideUpOut,
        },

        [`&${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-topLeft,
          &${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-top,
          &${muiCls}-slide-up-leave${muiCls}-slide-up-leave-active&-placement-topRight`]: {
          animationName: slideDownOut,
        },
      },
    },

    {
      // menu
      [`${componentCls} ${menuCls}`]: {
        position: 'relative',
        margin: 0,
      },

      [`${menuCls}-submenu-popup`]: {
        position: 'absolute',
        zIndex: zIndexPopup,
        background: 'transparent',
        boxShadow: 'none',
        transformOrigin: '0 0',
        'ul,li': {
          listStyle: 'none',
        },
        ul: {
          marginInline: '0.3em',
        },
      },

      [`${componentCls}, ${componentCls}-menu-submenu`]: {
        [menuCls]: {
          padding: `${dropdownEdgeChildPadding}px 0`,
          listStyleType: 'none',
          backgroundColor: colorBgElevated,
          backgroundClip: 'padding-box',
          borderRadius: token.controlRadius,
          outline: 'none',
          boxShadow: token.boxShadow,
          ...genFocusStyle(token),

          [`${menuCls}-item-group-title`]: {
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorTextDescription,
            transition: `all ${motionDurationFast}`,
          },

          // ======================= Item Content =======================
          [`${menuCls}-item`]: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          },

          [`${menuCls}-item-icon`]: {
            minWidth: fontSizeBase,
            marginInlineEnd: token.marginXS,
            fontSize: token.fontSizeSM,
          },

          [`${menuCls}-title-content`]: {
            flex: 'auto',
            '> a': {
              color: 'inherit',
              transition: `all ${motionDurationFast}`,
              '&:hover': {
                color: 'inherit',
              },
              '&::after': {
                position: 'absolute',
                inset: 0,
                content: '""',
              },
            },
          },

          // =========================== Item ===========================
          [`${menuCls}-item, ${menuCls}-submenu-title`]: {
            clear: 'both',
            margin: 0,
            padding: `${dropdownPaddingVertical}px ${controlPaddingHorizontal}px`,
            color: token.colorText,
            fontWeight: 'normal',
            fontSize: fontSizeBase,
            lineHeight: token.lineHeight,
            cursor: 'pointer',
            transition: `all ${motionDurationFast}`,

            '&:first-child': !dropdownEdgeChildPadding
              ? { borderRadius: `${radiusBase}px ${radiusBase}px 0 0` }
              : [],

            '&:last-child': !dropdownEdgeChildPadding
              ? { borderRadius: `0 0 ${radiusBase}px ${radiusBase}px` }
              : [],

            [`&:hover, &-active`]: {
              backgroundColor: token.controlItemBgHover,
            },

            // ...genFocusStyle(token),

            '&-selected': {
              color: token.colorPrimary,
              backgroundColor: token.controlItemBgActive,
              '&:hover, &-active': {
                backgroundColor: token.controlItemBgActiveHover,
              },
            },

            '&-disabled': {
              color: colorTextDisabled,
              cursor: 'not-allowed',
              '&:hover': {
                color: colorTextDisabled,
                backgroundColor: colorBgElevated,
                cursor: 'not-allowed',
              },
              a: {
                pointerEvents: 'none',
              },
            },

            '&-divider': {
              height: 1,
              margin: `${token.marginXXS}px 0`,
              overflow: 'hidden',
              lineHeight: 0,
              backgroundColor: token.colorFillContent,
            },

            [`${componentCls}-menu-submenu-expand-icon`]: {
              position: 'absolute',
              insetInlineEnd: token.paddingXS,

              [`${componentCls}-menu-submenu-arrow-icon`]: {
                marginInlineEnd: '0 !important',
                color: token.colorTextDescription,
                fontSize: fontSizeIcon,
                fontStyle: 'normal',
              },
            },
          },

          [`${menuCls}-item-group-list`]: {
            margin: `0 ${token.marginXS}px`,
            padding: 0,
            listStyle: 'none',
          },

          [`${menuCls}-submenu-title`]: {
            paddingInlineEnd: controlPaddingHorizontal + token.fontSizeSM,
          },

          [`${menuCls}-submenu-vertical`]: {
            position: 'relative',
          },

          [`${menuCls}-submenu${menuCls}-submenu-disabled ${componentCls}-menu-submenu-title`]: {
            [`&, ${componentCls}-menu-submenu-arrow-icon`]: {
              color: colorTextDisabled,
              backgroundColor: colorBgElevated,
              cursor: 'not-allowed',
            },
          },
          [`${menuCls}-submenu-selected ${componentCls}-menu-submenu-title`]: {
            color: token.colorPrimary,
          },
        },
      },
    },

    // Follow code may reuse in other components
    [
      initSlideMotion(token, 'slide-up'),
      initSlideMotion(token, 'slide-down'),
      initMoveMotion(token, 'move-up'),
      initMoveMotion(token, 'move-down'),
    ],
  ]
}

// ============================== Export ==============================
export default genComponentStyleHook(
  'Dropdown',
  (token, { rootPrefixCls }) => {
    const {
      marginXXS,
      sizePopupArrow,
      controlHeight,
      fontSizeBase,
      lineHeight,
      paddingXXS,
      componentCls,
      radiusOuter,
      radiusLG,
    } = token

    const dropdownPaddingVertical = (controlHeight - fontSizeBase * lineHeight) / 2
    const { dropdownArrowOffset } = getArrowOffset({
      sizePopupArrow,
      contentRadius: radiusLG,
      radiusOuter,
    })

    const dropdownToken = mergeToken<DropdownToken>(token, {
      menuCls: `${componentCls}-menu`,
      rootPrefixCls,
      dropdownArrowDistance: sizePopupArrow + marginXXS,
      dropdownArrowOffset,
      dropdownPaddingVertical,
      dropdownEdgeChildPadding: paddingXXS,
    })
    return [
      genBaseStyle(dropdownToken),
      genButtonStyle(dropdownToken),
      genStatusStyle(dropdownToken),
    ]
  },
  token => ({
    zIndexPopup: token.zIndexPopupBase + 50,
  }),
)
