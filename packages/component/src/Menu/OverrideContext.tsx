import * as React from 'react'
import type { MenuProps } from './Menu'
export interface OverrideContextProps {
  prefixCls?: string
  expandIcon?: React.ReactNode
  mode?: MenuProps['mode']
  selectable?: boolean
  validator?: (menuProps: Pick<MenuProps, 'mode'>) => void
  onClick?: () => void
}

const OverrideContext = React.createContext<OverrideContextProps | null>(null)

export const OverrideProvider = ({
  children,
  ...restProps
}: OverrideContextProps & { children: React.ReactNode }) => {
  const override = React.useContext(OverrideContext)

  const context = React.useMemo(
    () => ({
      ...override,
      ...restProps,
    }),
    [
      override,
      restProps.prefixCls,
      restProps.mode,
      restProps.selectable,
    ],
  )

  return <OverrideContext.Provider value={context}>{children}</OverrideContext.Provider>
}

export default OverrideContext
