import * as React from 'react'
import classNames from 'classnames'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import KeyCode from 'rc-util/lib/KeyCode'
import type { ButtonProps, LegacyButtonType } from '../Button/Button'
import { ConfigContext } from '../Provider'
import Popover from '../Popover'
import type { AbstractTooltipProps } from '../tooltip'
import type { RenderFunction } from '../utils/getRenderPropValue'
import { cloneElement } from '../utils/reactNode'
import PurePanel, { Overlay } from './Panel'

import usePopconfirmStyle from './styled'

export interface PopconfirmProps extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction
  disabled?: boolean
  onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void
  okText?: React.ReactNode
  okType?: LegacyButtonType
  cancelText?: React.ReactNode
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  showCancel?: boolean
  icon?: React.ReactNode
  onOpenChange?: (
    open: boolean,
    e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void
}

export interface PopconfirmState {
  open?: boolean
}

const Popconfirm = React.forwardRef<unknown, PopconfirmProps>((props, ref) => {
  const { getPrefixCls } = React.useContext(ConfigContext)
  const [open, setOpen] = useMergedState(false, {
    value: props.open,
    defaultValue: props.defaultOpen,
  })

  // const isDestroyed = useDestroyed()

  const settingOpen = (
    value: boolean,
    e?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    setOpen(value, true)
    props.onOpenChange?.(value, e)
  }

  const close = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingOpen(false, e)
  }

  const onConfirm = (e: React.MouseEvent<HTMLButtonElement>) => props.onConfirm?.call(this, e)

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingOpen(false, e)
    props.onCancel?.call(this, e)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KeyCode.ESC && open) {
      settingOpen(false, e)
    }
  }

  const onOpenChange = (value: boolean) => {
    const { disabled = false } = props
    if (disabled) {
      return
    }
    settingOpen(value)
  }

  const {
    prefixCls: customizePrefixCls,
    placement = 'top',
    trigger = 'click',
    okType = 'primary',
    icon = <ErrorOutlineOutlined />,
    children,
    overlayClassName,
    ...restProps
  } = props
  const prefixCls = getPrefixCls('popconfirm', customizePrefixCls)
  const overlayClassNames = classNames(prefixCls, overlayClassName)

  const [wrapSSR] = usePopconfirmStyle(prefixCls)

  return wrapSSR(
    <Popover
      {...restProps}
      trigger={trigger}
      placement={placement}
      onOpenChange={onOpenChange}
      open={open}
      ref={ref}
      overlayClassName={overlayClassNames}
      _overlay={
        <Overlay
          okType={okType}
          icon={icon}
          {...props}
          prefixCls={prefixCls}
          close={close}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      }
      data-popover-inject
    >
      {cloneElement(children, {
        onKeyDown: (e: React.KeyboardEvent<any>) => {
          if (React.isValidElement(children)) {
            children?.props.onKeyDown?.(e)
          }
          onKeyDown(e)
        },
      })}
    </Popover>,
  )
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<PopconfirmProps> & React.RefAttributes<unknown>
> & {
  _InternalPanel: typeof PurePanel
}

Popconfirm._InternalPanel = PurePanel

export default Popconfirm
