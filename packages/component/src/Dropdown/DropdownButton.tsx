import * as React from 'react'
import classNames from 'classnames'
import { MoreHoriz } from '@mui/icons-material'
import type { ButtonProps } from '../Button'
import Button from '../Button'
import type { ButtonHTMLType } from '../Button/Button'
import type { ButtonGroupProps } from '../Button/ButtonGroup'
import { ConfigContext } from '../Provider'
import type { DropdownProps } from './Dropdown'
import Dropdown from './Dropdown'
import Gap from '../Gap'
import { useCompactItemContext } from '../Gap/Compact'
import useStyle from './styled'

export type DropdownButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text'

export interface DropdownButtonProps extends ButtonGroupProps, DropdownProps {
  type?: DropdownButtonType
  htmlType?: ButtonHTMLType
  danger?: boolean
  disabled?: boolean
  loading?: ButtonProps['loading']
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  icon?: React.ReactNode
  href?: string
  children?: React.ReactNode
  title?: string
  buttonsRender?: (buttons: React.ReactNode[]) => React.ReactNode[]
}

interface DropdownButtonInterface extends React.FC<DropdownButtonProps> {}

const DropdownButton: DropdownButtonInterface = (props) => {
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
  } = React.useContext(ConfigContext)

  const {
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    disabled,
    loading,
    onClick,
    htmlType,
    children,
    className,
    menu,
    arrow,
    autoFocus,
    trigger,
    align,
    open,
    onOpenChange,
    placement,
    getPopupContainer,
    href,
    icon = <MoreHoriz />,
    title,
    buttonsRender = (buttons: React.ReactNode[]) => buttons,
    mouseEnterDelay,
    mouseLeaveDelay,
    overlayClassName,
    overlayStyle,
    destroyPopupOnHide,
    ...restProps
  } = props

  const prefixCls = getPrefixCls('dropdown', customizePrefixCls)
  const buttonPrefixCls = `${prefixCls}-button`
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const dropdownProps: DropdownProps = {
    menu,
    arrow,
    autoFocus,
    align,
    disabled,
    trigger: disabled ? [] : trigger,
    onOpenChange,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    mouseEnterDelay,
    mouseLeaveDelay,
    overlayClassName,
    overlayStyle,
    destroyPopupOnHide,
  }

  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls)

  const classes = classNames(buttonPrefixCls, compactItemClassnames, className, hashId)

  if ('open' in props) {
    dropdownProps.open = open
  }

  if ('placement' in props) {
    dropdownProps.placement = placement
  } else {
    dropdownProps.placement = 'bottomRight'
  }

  const leftButton = (
    <Button
      type={type}
      danger={danger}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      htmlType={htmlType}
      href={href}
      title={title}
    >
      {children}
    </Button>
  )

  const rightButton = <Button type={type} danger={danger} icon={icon} />

  const [leftButtonToRender, rightButtonToRender] = buttonsRender([leftButton, rightButton])

  return wrapSSR(
    <Gap.Compact className={classes} size={compactSize} block {...restProps}>
      {leftButtonToRender}
      <Dropdown {...dropdownProps}>{rightButtonToRender}</Dropdown>
    </Gap.Compact>,
  )
}

export default DropdownButton
