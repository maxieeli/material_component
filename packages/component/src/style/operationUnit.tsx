import type { CSSObject } from '@developerli/styled'
import type { DerivativeToken } from '../theme'

export const operationUnit = (token: DerivativeToken): CSSObject => ({
  color: token.colorLink,
  textDecoration: 'none',
  outline: 'none',
  cursor: 'pointer',
  transition: `color ${token.motionDurationSlow}`,

  '&:focus, &:hover': {
    color: token.colorLinkHover,
  },

  '&:active': {
    color: token.colorLinkActive,
  },
})
