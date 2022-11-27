import * as React from 'react'
import classNames from 'classnames'
import { ChevronRight } from '@mui/icons-material'
import BasicDropdown from '@developerli/basic-dropdown'
import useEvent from 'rc-util/lib/hooks/useEvent'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import { ConfigContext } from '../Provider'
import Menu from '../Menu'
import { OverrideProvider } from '../Menu/OverrideContext'
import type { MenuProps } from '../Menu/Menu'
import genPurePanel from '../utils/PurePanel'
import getPlacements from '../utils/placement'
import { cloneElement } from '../utils/reactNode'
import { tuple } from '../utils/type'
import DropdownButton from './DropdownButton'
import useStyle from './styled'

const Placements = tuple(
  'topLeft',
  'topCenter',
  'topRight',
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'top',
  'bottom',
)

type Placement = typeof Placements[number]

type OverlayFunc = () => React.ReactElement

type Align = {
  points?: [string, string]
  offset?: [number, number]
  targetOffset?: [number, number]
  overflow?: {
    adjustX?: boolean
    adjustY?: boolean
  }
  useCssRight?: boolean
  useCssBottom?: boolean
  useCssTransform?: boolean
}

export type DropdownArrowOptions = {
  pointAtCenter?: boolean
}

export interface DropdownProps {
  menu?: MenuProps
  autoFocus?: boolean
  arrow?: boolean | DropdownArrowOptions
  trigger?: ('click' | 'hover' | 'contextMenu')[]
  dropdownRender?: (originNode: React.ReactNode) => React.ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  disabled?: boolean
  destroyPopupOnHide?: boolean
  align?: Align
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  prefixCls?: string
  className?: string
  transitionName?: string
  placement?: Placement
  overlayClassName?: string
  overlayStyle?: React.CSSProperties
  forceRender?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  openClassName?: string
  children?: React.ReactNode
  /** @deprecated Please use `menu` instead */
  overlay?: React.ReactElement | OverlayFunc
}

interface DropdownInterface extends React.FC<DropdownProps> {
  Button: typeof DropdownButton
  _InternalPanel: typeof WrapPurePanel
}

const Dropdown: DropdownInterface = props => {
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
  } = React.useContext(ConfigContext)

  const getTransitionName = () => {
    const rootPrefixCls = getPrefixCls()
    const { placement = '', transitionName } = props
    if (transitionName !== undefined) {
      return transitionName
    }
    if (placement.includes('top')) {
      return `${rootPrefixCls}-slide-down`
    }
    return `${rootPrefixCls}-slide-up`
  }

  const getPlacement = () => {
    const { placement } = props
    if (!placement) {
      return 'bottomLeft'
    }

    if (placement.includes('Center')) {
      const newPlacement = placement.slice(0, placement.indexOf('Center'))
      return newPlacement
    }

    return placement
  }

  const {
    menu,
    arrow,
    prefixCls: customizePrefixCls,
    children,
    trigger,
    disabled,
    dropdownRender,
    getPopupContainer,
    overlayClassName,
    open,
    onOpenChange,
    mouseEnterDelay = 0.15,
    mouseLeaveDelay = 0.1,
  } = props

  const prefixCls = getPrefixCls('dropdown', customizePrefixCls)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const child = React.Children.only(children) as React.ReactElement<any>

  const dropdownTrigger = cloneElement(child, {
    className: classNames(
      `${prefixCls}-trigger`,
      child.props.className,
    ),
    disabled,
  })

  const triggerActions = disabled ? [] : trigger
  let alignPoint: boolean
  if (triggerActions && triggerActions.includes('contextMenu')) {
    alignPoint = true
  }

  // =========================== Open ============================
  const [mergedOpen, setOpen] = useMergedState(false, {
    value: open,
  })

  const onInnerOpenChange = useEvent((nextOpen: boolean) => {
    onOpenChange?.(nextOpen)
    setOpen(nextOpen)
  })

  // =========================== Overlay ============================
  const overlayClassNameCustomized = classNames(overlayClassName, hashId)

  const builtinPlacements = getPlacements({
    arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
    autoAdjustOverflow: true,
  })

  const onMenuClick = React.useCallback(() => {
    setOpen(false)
  }, [])

  const renderOverlay = () => {
    const { overlay } = props

    let overlayNode: React.ReactNode
    if (menu?.items) {
      overlayNode = <Menu {...menu} />
    } else if (typeof overlay === 'function') {
      overlayNode = overlay()
    } else {
      overlayNode = overlay
    }
    if (dropdownRender) {
      overlayNode = dropdownRender(overlayNode)
    }
    overlayNode = React.Children.only(
      typeof overlayNode === 'string' ? <span>{overlayNode}</span> : overlayNode,
    )

    return (
      <OverrideProvider
        prefixCls={`${prefixCls}-menu`}
        expandIcon={
          <span className={`${prefixCls}-menu-submenu-arrow`}>
            <ChevronRight className={`${prefixCls}-menu-submenu-arrow-icon`} />
          </span>
        }
        mode='vertical'
        selectable={false}
        onClick={onMenuClick}
      >
        {overlayNode}
      </OverrideProvider>
    )
  }

  // ============================ Render ============================
  return wrapSSR(
    <BasicDropdown
      alignPoint={alignPoint!}
      {...props}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      visible={mergedOpen}
      builtinPlacements={builtinPlacements}
      arrow={!!arrow}
      overlayClassName={overlayClassNameCustomized}
      prefixCls={prefixCls}
      getPopupContainer={getPopupContainer || getContextPopupContainer}
      transitionName={getTransitionName()}
      trigger={triggerActions}
      overlay={renderOverlay}
      placement={getPlacement()}
      onVisibleChange={onInnerOpenChange}
    >
      {dropdownTrigger}
    </BasicDropdown>,
  )
}

Dropdown.Button = DropdownButton

const PurePanel = genPurePanel(Dropdown, 'dropdown', prefixCls => prefixCls)

/* istanbul ignore next */
const WrapPurePanel = (props: DropdownProps) => (
  <PurePanel {...props}>
    <span />
  </PurePanel>
)

Dropdown._InternalPanel = WrapPurePanel

export default Dropdown
