import * as React from 'react'
import { Popup } from '@developerli/basic-tooltip'
import classNames from 'classnames'
import type { TooltipProps } from '.'
import { ConfigContext } from '../Provider'

import useStyle from './styled'
import { parseColor } from './util'

export interface PurePanelProps extends Omit<TooltipProps, 'children'> {}

export default function PurePanel(props: PurePanelProps) {
  const {
    prefixCls: customizePrefixCls,
    className,
    placement = 'top',
    title,
    color,
    overlayInnerStyle,
  } = props
  const { getPrefixCls } = React.useContext(ConfigContext)

  const prefixCls = getPrefixCls('tooltip', customizePrefixCls)
  const [wrapUI, hashId] = useStyle(prefixCls, true)

  // Color
  const colorInfo = parseColor(prefixCls, color)
  const formattedOverlayInnerStyle = { ...overlayInnerStyle, ...colorInfo.overlayStyle }
  const arrowContentStyle = colorInfo.arrowStyle

  return wrapUI(
    <div
      className={classNames(
        hashId,
        prefixCls,
        `${prefixCls}-pure`,
        `${prefixCls}-placement-${placement}`,
        className,
        colorInfo.className,
      )}
      style={arrowContentStyle}
    >
      <Popup
        {...props}
        className={hashId}
        prefixCls={prefixCls}
        overlayInnerStyle={formattedOverlayInnerStyle}
      >
        {title}
      </Popup>
    </div>,
  )
}
