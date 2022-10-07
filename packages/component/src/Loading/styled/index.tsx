import type { CSSObject } from '@developerli/styled'
import { Keyframes } from '@developerli/styled'
import type { FullToken, GenerateStyle } from '../../theme'
import { genComponentStyleHook, mergeToken } from '../../theme'
import { resetComponent } from '../../style'

export interface ComponentToken {
  contentHeight: number
}

interface LoadingToken extends FullToken<'Loading'> {
  loadDotDefault: string
  loadDotSize: number
  loadDotSizeSM: number
  loadDotSizeLG: number
}

const muiRotate = new Keyframes('muiRotate', {
  to: { transform: 'rotate(450deg)' },
})

const loadingCircle = new Keyframes('loadingCircle', {
  '0': {
    transform: 'rotate(360deg)'
  },
  '100%': {
    transform: 'rotate(450deg)'
  }
})

const genLoadingStyle: GenerateStyle<LoadingToken> = (token: LoadingToken): CSSObject => ({
  [`${token.componentCls}`]: {
    ...resetComponent(token),
    position: 'absolute',
    display: 'none',
    color: token.colorPrimary,
    textAlign: 'center',
    verticalAlign: 'middle',
    opacity: 0,
    transition: `transform ${token.motionDurationSlow} ${token.motionEaseInOutCirc}`,

    '&-loading': {
      position: 'static',
      display: 'inline-block',
      opacity: 1,
    },
    
  }
})

export default genComponentStyleHook(
  'Loading',
  token => {
    const loadingToken = mergeToken<LoadingToken>(token, {
      loadDotDefault: token.colorTextDescription,
      loadDotSize: token.controlHeightLG / 2,
      loadDotSizeSM: token.controlHeightLG * 0.35,
      loadDotSizeLG: token.controlHeight,
    })
    return [genLoadingStyle(loadingToken)]
  },
  {
    controlHeight: 400,
  }
)

