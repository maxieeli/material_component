import { createContext } from 'react'

export type MenuTheme = 'light' | 'dark'

export interface MenuContextProps {
  prefixCls: string
  inlineCollapsed: boolean
  theme?: MenuTheme
  firstLevel: boolean
  disableMenuItemTitleTooltip?: boolean
}

const MenuContext = createContext<MenuContextProps>({
  prefixCls: '',
  firstLevel: true,
  inlineCollapsed: false,
})

export default MenuContext
