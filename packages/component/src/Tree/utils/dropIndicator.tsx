import React from 'react'

export const offset = 4

export default function dropIndicatorRender(props: {
  dropPosition: -1 | 0 | 1
  dropLevelOffset: number
  indent: number
  prefixCls: string
}) {
  const { dropPosition, dropLevelOffset, prefixCls, indent } = props
  const startPosition = 'right'
  const endPosition = 'left'
  const style: React.CSSProperties = {
    [startPosition]: -dropLevelOffset * indent + offset,
    [endPosition]: 0,
  }
  switch (dropPosition) {
    case -1:
      style.top = -3
      break
    case 1:
      style.bottom = -7 // -3 -> -7
      break
    default:
      style.bottom = -7 // -3 -> -7
      style[startPosition] = indent + offset
      break
  }
  return <div style={style} className={`${prefixCls}-drop-indicator`} />
}
