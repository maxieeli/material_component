import * as React from 'react'
import { forwardRef } from 'react'
import { MoreHoriz } from '@mui/icons-material'
import type { MenuProps as BasicMenuProps, MenuRef as BasicMenuRef } from '@developerli/basic-menu'
import BasicMenu from '@developerli/basic-menu'
import omit from 'rc-util/lib/omit'
import useEvent from 'rc-util/lib/hooks/useEvent'
import classNames from 'classnames'
import initCollapseMotion from '../utils/motion'
import { cloneElement } from '../utils/reactNode'
import type { SiderContextProps } from '../layout/Sider'
import { ConfigContext } from '../Provider'
import OverrideContext from './OverrideContext'
import useItems from './useItem'
import type { ItemType } from './useItem'
import MenuContext from './MenuContext'
import type { MenuTheme } from './MenuContext'
import useStyle from './styled'
export interface MenuProps extends Omit<BasicMenuProps, 'items'> {
  theme?: MenuTheme
  inlineIndent?: number
  _internalDisableMenuItemTitleTooltip?: boolean
  items?: ItemType[]
}

type InternalMenuProps = MenuProps &
  SiderContextProps & {
    collapsedWidth?: string | number
  }

const InternalMenu = forwardRef<BasicMenuRef, InternalMenuProps>((props, ref) => {
  const override = React.useContext(OverrideContext)
  const overrideObj = override || {}

  const { getPrefixCls, getPopupContainer } = React.useContext(ConfigContext)
  const rootPrefixCls = getPrefixCls()

  const {
    prefixCls: customizePrefixCls,
    className,
    theme = 'light',
    expandIcon,
    _internalDisableMenuItemTitleTooltip,
    inlineCollapsed,
    siderCollapsed,
    items,
    children,
    rootClassName,
    mode,
    selectable,
    onClick,
    ...restProps
  } = props

  const passedProps = omit(restProps, ['collapsedWidth'])

  // ========================= Items ===========================
  const mergedChildren = useItems(items) || children
  overrideObj.validator?.({ mode })

  // ========================== Click ==========================
  // Tell dropdown that item clicked
  const onItemClick = useEvent<Required<MenuProps>['onClick']>((...args) => {
    onClick?.(...args)
    overrideObj.onClick?.()
  })

  // ========================== Mode ===========================
  const mergedMode = overrideObj.mode || mode

  // ======================= Selectable ========================
  const mergedSelectable = selectable ?? overrideObj.selectable

  // ======================== Collapsed ========================
  // Inline Collapsed
  const mergedInlineCollapsed = React.useMemo(() => {
    if (siderCollapsed !== undefined) {
      return siderCollapsed
    }
    return inlineCollapsed
  }, [inlineCollapsed, siderCollapsed])

  const defaultMotions = {
    horizontal: { motionName: `${rootPrefixCls}-slide-up` },
    inline: initCollapseMotion(rootPrefixCls),
    other: { motionName: `${rootPrefixCls}-zoom-big` },
  }

  const prefixCls = getPrefixCls('menu', customizePrefixCls || overrideObj.prefixCls)
  const [wrapSSR, hashId] = useStyle(prefixCls, !override)
  const menuClassName = classNames(`${prefixCls}-${theme}`, className)

  // ====================== Expand Icon ========================
  let mergedExpandIcon: MenuProps[`expandIcon`]
  if (typeof expandIcon === 'function') {
    mergedExpandIcon = expandIcon
  } else {
    mergedExpandIcon = cloneElement(expandIcon || overrideObj.expandIcon, {
      className: `${prefixCls}-submenu-expand-icon`,
    })
  }

  // ======================== Context ==========================
  const contextValue = React.useMemo(
    () => ({
      prefixCls,
      inlineCollapsed: mergedInlineCollapsed || false,
      firstLevel: true,
      theme,
      disableMenuItemTitleTooltip: _internalDisableMenuItemTitleTooltip,
    }),
    [prefixCls, mergedInlineCollapsed, _internalDisableMenuItemTitleTooltip, theme],
  )

  // ========================= Render ==========================
  return wrapSSR(
    <OverrideContext.Provider value={null}>
      <MenuContext.Provider value={contextValue}>
        <BasicMenu
          getPopupContainer={getPopupContainer}
          overflowedIndicator={<MoreHoriz />}
          overflowedIndicatorPopupClassName={`${prefixCls}-${theme}`}
          mode={mergedMode}
          selectable={mergedSelectable}
          onClick={onItemClick}
          {...passedProps}
          inlineCollapsed={mergedInlineCollapsed}
          className={menuClassName}
          prefixCls={prefixCls}
          defaultMotions={defaultMotions}
          expandIcon={mergedExpandIcon}
          ref={ref}
          rootClassName={classNames(rootClassName, hashId)}
        >
          {mergedChildren}
        </BasicMenu>
      </MenuContext.Provider>
    </OverrideContext.Provider>,
  )
})

export default InternalMenu
