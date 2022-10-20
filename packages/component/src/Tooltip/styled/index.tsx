import type { CSSObject } from '@developerli/styled'
import type {
  FullToken,
  GenerateStyle,
  PresetColorType,
  UseComponentStyleResult,
} from '../../theme'
import { genComponentStyleHook, mergeToken, PresetColors } from '../../theme'
import { resetComponent } from '../../style'
import getArrowStyle, { MAX_VERTICAL_CONTENT_RADIUS } from '../../style/placementArrow'

export interface ComponentToken {
  zIndexPopup: number
  colorBgDefault: string
}

interface TooltipToken extends FullToken<'Tooltip'> {
  // default variables
  tooltipMaxWidth: number
  tooltipColor: string
  tooltipBg: string
  tooltipBorderRadius: number
  tooltipRadiusOuter: number
}

const generatorTooltipPresetColor: GenerateStyle<TooltipToken, CSSObject> = token => {
  const { componentCls } = token

  return PresetColors.reduce((previousValue: any, currentValue: keyof PresetColorType) => {
    const lightColor = token[`${currentValue}-6`]
    previousValue[`&${componentCls}-${currentValue}`] = {
      [`${componentCls}-inner`]: {
        backgroundColor: lightColor,
      },
      [`${componentCls}-arrow`]: {
        '--mui-arrow-background-color': lightColor,
      },
    }
    return previousValue
  }, {})
}

const genTooltipStyle: GenerateStyle<TooltipToken> = token => {
  const {
    componentCls,
    tooltipMaxWidth,
    tooltipColor,
    tooltipBg,
    tooltipBorderRadius,
    zIndexPopup,
    controlHeight,
    boxShadowSecondary,
    paddingSM,
    paddingXS,
    tooltipRadiusOuter,
    boxShadow,
  } = token

  return [
    {
      [componentCls]: {
        ...resetComponent(token),
        position: 'absolute',
        zIndex: zIndexPopup,
        display: 'block',
        '&': [{ width: 'max-content' }, { width: 'intrinsic' }],
        maxWidth: tooltipMaxWidth,
        visibility: 'visible',
        '&-hidden': {
          display: 'none',
        },

        '--mui-arrow-background-color': tooltipBg,

        // Wrapper for the tooltip content
        [`${componentCls}-inner`]: {
          minWidth: controlHeight,
          minHeight: `${controlHeight - 6}px`,
          margin: `${paddingXS / 4}px`,
          padding: `${paddingSM / 2}px ${paddingXS}px`,
          color: tooltipColor,
          textAlign: 'start',
          textDecoration: 'none',
          wordWrap: 'break-word',
          backgroundColor: tooltipBg,
          borderRadius: `${tooltipBorderRadius * 2}px`,
          boxShadow,
          opacity: 1,
          transform: 'none',
          transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 133ms cubic-bezier(0.4, 0, 0.2, 1)0ms',
          transformOrigin: 'center top',
        },

        [[
          `&-placement-left`,
          `&-placement-leftTop`,
          `&-placement-leftBottom`,
          `&-placement-right`,
          `&-placement-rightTop`,
          `&-placement-rightBottom`,
        ].join(',')]: {
          [`${componentCls}-inner`]: {
            borderRadius:
              tooltipBorderRadius > MAX_VERTICAL_CONTENT_RADIUS
                ? MAX_VERTICAL_CONTENT_RADIUS
                : tooltipBorderRadius,
          },
        },

        [`${componentCls}-content`]: {
          position: 'relative',
        },

        // generator for preset color
        ...generatorTooltipPresetColor(token),
      },
    },

    // Arrow Style
    getArrowStyle<TooltipToken>(
      mergeToken<TooltipToken>(token, {
        radiusOuter: tooltipRadiusOuter,
      }),
      {
        colorBg: 'var(--mui-arrow-background-color)',
        showArrowCls: '',
        contentRadius: tooltipBorderRadius,
        limitVerticalRadius: true,
      },
    ),

    // Pure Render
    {
      [`${componentCls}-pure`]: {
        position: 'relative',
        maxWidth: 'none',
      },
    },
  ]
}

// ============================== Export ==============================
export default (prefixCls: string, injectStyle: boolean): UseComponentStyleResult => {
  const useOriginHook = genComponentStyleHook(
    'Tooltip',
    token => {
      // Popover use Tooltip as internal component. We do not need to handle this.
      if (injectStyle === false) {
        return []
      }

      const { radiusBase, colorTextLightSolid, radiusOuter } = token

      const TooltipToken = mergeToken<TooltipToken>(token, {
        // default variables
        tooltipMaxWidth: 250,
        tooltipColor: colorTextLightSolid,
        tooltipBorderRadius: radiusBase,
        // tooltipBg: colorBgDefault,
        tooltipBg: '#616161eb',
        tooltipRadiusOuter: radiusOuter > 4 ? 4 : radiusOuter,
      })

      return [genTooltipStyle(TooltipToken)]
    },
    ({ zIndexPopupBase, colorBgSpotlight }) => ({
      zIndexPopup: zIndexPopupBase + 70,
      colorBgDefault: colorBgSpotlight,
    }),
  )
  return useOriginHook(prefixCls)
}
