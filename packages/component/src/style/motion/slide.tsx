import type { CSSInterpolation } from '@developerli/styled'
import { Keyframes } from '@developerli/styled'
import type { AliasToken } from '../../theme'
import type { TokenWithCommonCls } from '../../theme/utils/genComponentStyleHook'
import { initMotion } from './motion'

export const slideUpIn = new Keyframes('muiSlideUpIn', {
  '0%': {
    transform: 'scaleY(0.8)',
    transformOrigin: '0% 0%',
    opacity: 0,
  },

  '100%': {
    transform: 'scaleY(1)',
    transformOrigin: '0% 0%',
    opacity: 1,
  },
})

export const slideUpOut = new Keyframes('muiSlideUpOut', {
  '0%': {
    transform: 'scaleY(1)',
    transformOrigin: '0% 0%',
    opacity: 1,
  },

  '100%': {
    transform: 'scaleY(0.8)',
    transformOrigin: '0% 0%',
    opacity: 0,
  },
})

export const slideDownIn = new Keyframes('muiSlideDownIn', {
  '0%': {
    transform: 'scaleY(0.8)',
    transformOrigin: '100% 100%',
    opacity: 0,
  },

  '100%': {
    transform: 'scaleY(1)',
    transformOrigin: '100% 100%',
    opacity: 1,
  },
})

export const slideDownOut = new Keyframes('muiSlideDownOut', {
  '0%': {
    transform: 'scaleY(1)',
    transformOrigin: '100% 100%',
    opacity: 1,
  },

  '100%': {
    transform: 'scaleY(0.8)',
    transformOrigin: '100% 100%',
    opacity: 0,
  },
})

export const slideLeftIn = new Keyframes('muiSlideLeftIn', {
  '0%': {
    transform: 'scaleX(0.8)',
    transformOrigin: '0% 0%',
    opacity: 0,
  },

  '100%': {
    transform: 'scaleX(1)',
    transformOrigin: '0% 0%',
    opacity: 1,
  },
})

export const slideLeftOut = new Keyframes('muiSlideLeftOut', {
  '0%': {
    transform: 'scaleX(1)',
    transformOrigin: '0% 0%',
    opacity: 1,
  },

  '100%': {
    transform: 'scaleX(0.8)',
    transformOrigin: '0% 0%',
    opacity: 0,
  },
})

export const slideRightIn = new Keyframes('muiSlideRightIn', {
  '0%': {
    transform: 'scaleX(0.8)',
    transformOrigin: '100% 0%',
    opacity: 0,
  },

  '100%': {
    transform: 'scaleX(1)',
    transformOrigin: '100% 0%',
    opacity: 1,
  },
})

export const slideRightOut = new Keyframes('muiSlideRightOut', {
  '0%': {
    transform: 'scaleX(1)',
    transformOrigin: '100% 0%',
    opacity: 1,
  },

  '100%': {
    transform: 'scaleX(0.8)',
    transformOrigin: '100% 0%',
    opacity: 0,
  },
})

type SlideMotionTypes = 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
const slideMotion: Record<SlideMotionTypes, { inKeyframes: Keyframes; outKeyframes: Keyframes }> = {
  'slide-up': {
    inKeyframes: slideUpIn,
    outKeyframes: slideUpOut,
  },
  'slide-down': {
    inKeyframes: slideDownIn,
    outKeyframes: slideDownOut,
  },
  'slide-left': {
    inKeyframes: slideLeftIn,
    outKeyframes: slideLeftOut,
  },
  'slide-right': {
    inKeyframes: slideRightIn,
    outKeyframes: slideRightOut,
  },
}

export const initSlideMotion = (
  token: TokenWithCommonCls<AliasToken>,
  motionName: SlideMotionTypes,
): CSSInterpolation => {
  const { muiCls } = token
  const motionCls = `${muiCls}-${motionName}`
  const { inKeyframes, outKeyframes } = slideMotion[motionName]

  return [
    initMotion(motionCls, inKeyframes, outKeyframes, token.motionDurationMid),

    {
      [`
      ${motionCls}-enter,
      ${motionCls}-appear
    `]: {
        opacity: 0,
        animationTimingFunction: token.motionEaseOutQuint,
      },

      [`${motionCls}-leave`]: {
        animationTimingFunction: token.motionEaseInQuint,
      },
    },
  ]
}
