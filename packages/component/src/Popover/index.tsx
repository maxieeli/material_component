import classNames from 'classnames'
import * as React from 'react'
import { ConfigContext } from '../Provider'
import type { AbstractTooltipProps } from '../tooltip'
import Tooltip from '../tooltip'
import type { RenderFunction } from '../utils/getRenderPropValue'
import { getRenderPropValue } from '../utils/getRenderPropValue'
// import { getTransitionName } from '../utils/motion'
import PurePanel from './Panel'
// CSSINJS
import useStyle from './styled'

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction
  content?: React.ReactNode | RenderFunction
  _overlay?: React.ReactNode
}

interface OverlayPorps {
  prefixCls?: string
  title?: PopoverProps['title']
  content?: PopoverProps['content']
}

const Overlay: React.FC<OverlayPorps> = ({ title, content, prefixCls }) => {
  if (!title && !content) {
    return null
  }
  return (
    <>
      {title && <div className={`${prefixCls}-title`}>{getRenderPropValue(title)}</div>}
      <div className={`${prefixCls}-inner-content`}>{getRenderPropValue(content)}</div>
    </>
  )
}

const Popover = React.forwardRef<unknown, PopoverProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    title,
    content,
    overlayClassName,
    _overlay,
    placement = 'top',
    trigger = 'hover',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle = {},
    ...otherProps
  } = props
  const { getPrefixCls } = React.useContext(ConfigContext)

  const prefixCls = getPrefixCls('popover', customizePrefixCls)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const rootPrefixCls = getPrefixCls()

  const overlayCls = classNames(overlayClassName, hashId)

  return wrapSSR(
    <Tooltip
      placement={placement}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      overlayStyle={overlayStyle}
      {...otherProps}
      prefixCls={prefixCls}
      overlayClassName={overlayCls}
      ref={ref}
      overlay={_overlay || <Overlay prefixCls={prefixCls} title={title} content={content} />}
      data-popover-inject
    />,
  )
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<PopoverProps> & React.RefAttributes<unknown>
> & {
  _InternalPanel: typeof PurePanel
}

Popover.displayName = 'Popover'
Popover._InternalPanel = PurePanel

export default Popover
