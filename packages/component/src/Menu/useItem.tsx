import { ItemGroup } from '@developerli/basic-menu'
import type {
  MenuDividerType as BasicMenuDividerType,
  MenuItemGroupType as BasicMenuItemGroupType,
  MenuItemType as BasicMenuItemType,
  SubMenuType as BasicSubMenuType,
} from '@developerli/basic-menu/es/interface'
import * as React from 'react'
import MenuDivider from './MenuDivider'
import MenuItem from './MenuItem'
import SubMenu from './SubMenu'

export interface MenuItemType extends BasicMenuItemType {
  danger?: boolean
  icon?: React.ReactNode
  title?: string
}

export interface SubMenuType extends Omit<BasicSubMenuType, 'children'> {
  icon?: React.ReactNode
  theme?: 'dark' | 'light'
  children: ItemType[]
}

export interface MenuItemGroupType extends Omit<BasicMenuItemGroupType, 'children'> {
  children?: ItemType[]
  key?: React.Key
}

export interface MenuDividerType extends BasicMenuDividerType {
  dashed?: boolean
  key?: React.Key
}

export type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null

function convertItemsToNodes(list: ItemType[]) {
  return (list || [])
    .map((opt, index) => {
      if (opt && typeof opt === 'object') {
        const { label, children, key, type, ...restProps } = opt as any
        const mergedKey = key ?? `tmp-${index}`

        if (children || type === 'group') {
          if (type === 'group') {
            return (
              <ItemGroup key={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children)}
              </ItemGroup>
            )
          }

          // Sub Menu
          return (
            <SubMenu key={mergedKey} {...restProps} title={label}>
              {convertItemsToNodes(children)}
            </SubMenu>
          )
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <MenuDivider key={mergedKey} {...restProps} />
        }

        return (
          <MenuItem key={mergedKey} {...restProps}>
            {label}
          </MenuItem>
        )
      }

      return null
    })
    .filter(opt => opt)
}

export default function useItems(items?: ItemType[]) {
  return React.useMemo(() => {
    if (!items) {
      return items
    }

    return convertItemsToNodes(items)
  }, [items])
}
