import classNames from 'classnames'
import BasicTooltip from '@developerli/basic-tooltip'
import type { placements as Placements } from '@developerli/basic-tooltip/es/placements'
import type { TooltipProps as BasicTooltipProps } from '@developerli/basic-tooltip/es/Tooltip'
import type { AlignType } from 'rc-trigger/lib/interface'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import * as React from 'react'
import { ConfigContext } from '../Provider'
import type { PresetColorType } from '../utils/colors'
import { getTransitionName } from '../utils/motion'
import getPlacements, { AdjustOverflow, PlacementsConfig } from '../utils/placement'
import { cloneElement, isValidElement, isFragment } from '../utils/reactNode'
import type { LiteralUnion } from '../utils/type'
import PurePanel from './Panel'
import useStyle from './styled'
import { parseColor } from './util'

export { AdjustOverflow, PlacementsConfig }

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'

export interface TooltipAlignConfig {
  points?: [string, string]
  offset?: [number | string, number | string]
  targetOffset?: [number | string, number | string]
  overflow?: { adjustX: boolean; adjustY: boolean }
  useCssRight?: boolean
  useCssBottom?: boolean
  useCssTransform?: boolean
}
// remove this after BasicTooltip switch visible to open.
interface LegacyTooltipProps
  extends Partial<
    Omit<
      BasicTooltipProps,
      'children' | 'visible' | 'defaultVisible' | 'onVisibleChange' | 'afterVisibleChange'
    >
  > {
  open?: BasicTooltipProps['visible']
  defaultOpen?: BasicTooltipProps['defaultVisible']
  onOpenChange?: BasicTooltipProps['onVisibleChange']
  afterOpenChange?: BasicTooltipProps['afterVisibleChange']
}

export interface AbstractTooltipProps extends LegacyTooltipProps {
  style?: React.CSSProperties
  className?: string
  color?: LiteralUnion<PresetColorType, string>
  placement?: TooltipPlacement
  builtinPlacements?: typeof Placements
  openClassName?: string
  arrowPointAtCenter?: boolean
  autoAdjustOverflow?: boolean | AdjustOverflow
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  children?: React.ReactNode
}

export type RenderFunction = () => React.ReactNode

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction
  overlay?: React.ReactNode | RenderFunction
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction
  overlay?: React.ReactNode | RenderFunction
}

export declare type TooltipProps = TooltipPropsWithTitle | TooltipPropsWithOverlay

const splitObject = <T extends React.CSSProperties>(
  obj: T,
  keys: (keyof T)[],
): Record<'picked' | 'omitted', T> => {
  const picked: T = {} as T
  const omitted: T = { ...obj }
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key]
      delete omitted[key]
    }
  })
  return { picked, omitted }
}

function getDisabledCompatibleChildren(element: React.ReactElement<any>, prefixCls: string) {
  const elementType = element.type as any
  if (
    ((element.type === 'button') && element.props.disabled) ||
    ((element.props.disabled || element.props.loading)) ||
    (element.props.disabled)
  ) {
    const { picked, omitted } = splitObject(element.props.style, [
      'position',
      'left',
      'right',
      'top',
      'bottom',
      'float',
      'display',
      'zIndex',
    ])
    const spanStyle: React.CSSProperties = {
      display: 'inline-block', // default inline-block is important
      ...picked,
      cursor: 'not-allowed',
      width: element.props.block ? '100%' : undefined,
    }
    const buttonStyle: React.CSSProperties = {
      ...omitted,
      pointerEvents: 'none',
    }
    const child = cloneElement(element, {
      style: buttonStyle,
      className: null,
    })
    return (
      <span
        style={spanStyle}
        className={classNames(element.props.className, `${prefixCls}-disabled-compatible-wrapper`)}
      >
        {child}
      </span>
    )
  }
  return element
}

const Tooltip = React.forwardRef<unknown, TooltipProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    openClassName,
    getTooltipContainer,
    overlayClassName,
    color,
    overlayInnerStyle,
    children,
    afterOpenChange,
  } = props

  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
  } = React.useContext(ConfigContext)

  const [open, setOpen] = useMergedState(false, {
    value: props.open,
    defaultValue: props.defaultOpen,
  })

  const isNoTitle = () => {
    const { title, overlay } = props
    return !title && !overlay && title !== 0 // overlay for old version compatibility
  }

  const onOpenChange = (vis: boolean) => {
    setOpen(isNoTitle() ? false : vis)

    if (!isNoTitle()) {
      props.onOpenChange?.(vis)
    }
  }

  const getTooltipPlacements = () => {
    const { builtinPlacements, arrowPointAtCenter = false, autoAdjustOverflow = true } = props
    return (
      builtinPlacements ||
      getPlacements({
        arrowPointAtCenter,
        autoAdjustOverflow,
      })
    )
  }

  // 动态设置动画点
  const onPopupAlign = (domNode: HTMLElement, align: AlignType) => {
    const placements = getTooltipPlacements()
    // 当前返回的位置
    const placement = Object.keys(placements).find(
      key =>
        placements[key].points![0] === align.points?.[0] &&
        placements[key].points![1] === align.points?.[1],
    )
    if (!placement) {
      return
    }
    // 根据当前坐标设置动画点
    const rect = domNode.getBoundingClientRect()

    const transformOrigin = { top: '50%', left: '50%' }

    if (['top', 'Bottom'].includes(placement)) {
      transformOrigin.top = `${rect.height - align.offset![1]}px`
    } else if (['Top', 'bottom'].includes(placement)) {
      transformOrigin.top = `${-align.offset![1]}px`
    }
    if (['left', 'Right'].includes(placement)) {
      transformOrigin.left = `${rect.width - align.offset![0]}px`
    } else if (['right', 'Left'].includes(placement)) {
      transformOrigin.left = `${-align.offset![0]}px`
    }
    domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`
  }

  const getOverlay = () => {
    const { title, overlay } = props
    if (title === 0) {
      return title
    }
    return overlay || title || ''
  }

  const {
    getPopupContainer,
    placement = 'top',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle,
    ...otherProps
  } = props

  const prefixCls = getPrefixCls('tooltip', customizePrefixCls)
  const rootPrefixCls = getPrefixCls()

  const injectFromPopover = (props as any)['data-popover-inject']

  let tempOpen = open
  // Hide tooltip when there is no title
  if (!('open' in props) && !('visible' in props) && isNoTitle()) {
    tempOpen = false
  }

  const child = getDisabledCompatibleChildren(
    isValidElement(children) && !isFragment(children) ? children : <span>{children}</span>,
    prefixCls,
  )
  const childProps = child.props
  const childCls =
    !childProps.className || typeof childProps.className === 'string'
      ? classNames(childProps.className, {
          [openClassName || `${prefixCls}-open`]: true,
        })
      : childProps.className

  // Style
  const [wrapUI, hashId] = useStyle(prefixCls, !injectFromPopover)

  // Color
  const colorInfo = parseColor(prefixCls, color)
  const formattedOverlayInnerStyle = { ...overlayInnerStyle, ...colorInfo.overlayStyle }
  const arrowContentStyle = colorInfo.arrowStyle

  const customOverlayClassName = classNames(
    overlayClassName,
    colorInfo.className,
    hashId,
  )

  return wrapUI(
    <BasicTooltip
      {...otherProps}
      placement={placement}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      prefixCls={prefixCls}
      overlayClassName={customOverlayClassName}
      overlayStyle={{
        ...arrowContentStyle,
        ...overlayStyle,
      }}
      getTooltipContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
      ref={ref}
      builtinPlacements={getTooltipPlacements()}
      overlay={getOverlay()}
      visible={tempOpen}
      onVisibleChange={onOpenChange}
      afterVisibleChange={afterOpenChange}
      onPopupAlign={onPopupAlign}
      overlayInnerStyle={formattedOverlayInnerStyle}
      arrowContent={<span className={`${prefixCls}-arrow-content`} />}
      motion={{
        motionName: getTransitionName(rootPrefixCls, 'zoom-big-fast'),
        motionDeadline: 1000,
      }}
    >
      {tempOpen ? cloneElement(child, { className: childCls }) : child}
    </BasicTooltip>,
  )
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TooltipProps> & React.RefAttributes<unknown>
> & {
  _InternalPanel: typeof PurePanel
}

Tooltip.displayName = 'Tooltip'
Tooltip._InternalPanel = PurePanel

export default Tooltip
