import type * as React from 'react'
import classNames from 'classnames'
import { PresetColorTypes } from '../utils/colors'

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`)

export function parseColor(prefixCls: string, color?: string) {
  const className = classNames({
    [`${prefixCls}-${color}`]: color && PresetColorRegex.test(color),
  })

  let overlayStyle: React.CSSProperties | undefined
  let arrowStyle: React.CSSProperties | undefined

  if (color && !PresetColorRegex.test(color)) {
    overlayStyle = { background: color }
    // @ts-ignore
    arrowStyle = { '--mui-arrow-background-color': color }
  }

  return { className, overlayStyle, arrowStyle }
}
