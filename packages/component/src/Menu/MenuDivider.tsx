import * as React from 'react'
import classNames from 'classnames'
import { Divider } from '@developerli/basic-menu'
import { ConfigContext } from '../Provider'

export interface MenuDividerProps extends React.HTMLAttributes<HTMLLIElement> {
  className?: string
  prefixCls?: string
  style?: React.CSSProperties
  dashed?: boolean
}

const MenuDivider: React.FC<MenuDividerProps> = ({
  prefixCls: customizePrefixCls,
  className,
  dashed,
  ...restProps
}) => {
  const { getPrefixCls } = React.useContext(ConfigContext)

  const prefixCls = getPrefixCls('menu', customizePrefixCls)
  const classString = classNames(
    {
      [`${prefixCls}-item-divider-dashed`]: !!dashed,
    },
    className,
  )

  return <Divider className={classString} {...restProps} />
}

export default MenuDivider
