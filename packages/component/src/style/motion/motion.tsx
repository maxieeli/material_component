import type { CSSObject, Keyframes } from '@developerli/styled';

const initMotionCommon = (duration: string): CSSObject => ({
  animationDuration: duration,
  animationFillMode: 'both',
});

const initMotionCommonLeave = (duration: string): CSSObject => ({
  animationDuration: duration,
  animationFillMode: 'both',
});

export const initMotion = (
  motionCls: string,
  inKeyframes: Keyframes,
  outKeyframes: Keyframes,
  duration: string,
): CSSObject => ({
  [`
    ${motionCls}-enter,
    ${motionCls}-appear
  `]: {
    ...initMotionCommon(duration),
    animationPlayState: 'paused',
  },

  [`${motionCls}-leave`]: {
    ...initMotionCommonLeave(duration),
    animationPlayState: 'paused',
  },

  [`
    ${motionCls}-enter${motionCls}-enter-active,
    ${motionCls}-appear${motionCls}-appear-active
  `]: {
    animationName: inKeyframes,
    animationPlayState: 'running',
  },

  [`${motionCls}-leave${motionCls}-leave-active`]: {
    animationName: outKeyframes,
    animationPlayState: 'running',
    pointerEvents: 'none',
  },
});
