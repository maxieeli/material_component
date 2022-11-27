import classNames from 'classnames'
import toArray from 'rc-util/lib/Children/toArray'
import * as React from 'react'
import { ConfigContext } from '../Provider'
import type { SizeType } from '../Provider/SizeContext'
import useFlexGapSupport from '../utils/useFlexGapSupport'
import Item from './Item'
import Compact from './Compact'
import useStyle from './styled'

export const GapContext = React.createContext({
  latestIndex: 0,
  horizontalSize: 0,
  verticalSize: 0,
  supportFlexGap: false,
})

export type GapSize = SizeType | number

export interface GapProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
  className?: string
  style?: React.CSSProperties
  size?: GapSize | [GapSize, GapSize]
  direction?: 'horizontal' | 'vertical'
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline'
  split?: React.ReactNode
  wrap?: boolean
}

const gapSize = {
  small: 8,
  middle: 16,
  large: 24,
}

function getNumberSize(size: GapSize) {
  return typeof size === 'string' ? gapSize[size] : size || 0
}

const Gap: React.FC<GapProps> = (props) => {
  const { getPrefixCls, gap } = React.useContext(ConfigContext)

  const {
    size = gap?.size || 'small',
    align,
    className,
    children,
    direction = 'horizontal',
    prefixCls: customizePrefixCls,
    split,
    style,
    wrap = false,
    ...otherProps
  } = props

  const supportFlexGap = useFlexGapSupport()

  const [horizontalSize, verticalSize] = React.useMemo(
    () =>
      ((Array.isArray(size) ? size : [size, size]) as [GapSize, GapSize]).map((item) =>
        getNumberSize(item),
      ),
    [size],
  )

  const childNodes = toArray(children, { keepEmpty: true })

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align
  const prefixCls = getPrefixCls('gap', customizePrefixCls)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const cn = classNames(
    prefixCls,
    hashId,
    `${prefixCls}-${direction}`,
    {
      [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
    },
    className,
  )

  const itemClassName = `${prefixCls}-item`

  const marginDirection = 'marginRight'

  // Calculate latest one
  let latestIndex = 0
  const nodes = childNodes.map((child, i) => {
    if (child !== null && child !== undefined) {
      latestIndex = i
    }

    const key = (child && child.key) || `${itemClassName}-${i}`

    return (
      <Item
        className={itemClassName}
        key={key}
        direction={direction}
        index={i}
        marginDirection={marginDirection}
        split={split}
        wrap={wrap}
      >
        {child}
      </Item>
    )
  })

  const gapContext = React.useMemo(
    () => ({ horizontalSize, verticalSize, latestIndex, supportFlexGap }),
    [horizontalSize, verticalSize, latestIndex, supportFlexGap],
  )

  // Render
  if (childNodes.length === 0) {
    return null
  }

  const gapStyle: React.CSSProperties = {}

  if (wrap) {
    gapStyle.flexWrap = 'wrap'

    // Patch for gap not support
    if (!supportFlexGap) {
      gapStyle.marginBottom = -verticalSize
    }
  }

  if (supportFlexGap) {
    gapStyle.columnGap = horizontalSize
    gapStyle.rowGap = verticalSize
  }

  return wrapSSR(
    <div
      className={cn}
      style={{
        ...gapStyle,
        ...style,
      }}
      {...otherProps}
    >
      <GapContext.Provider value={gapContext}>{nodes}</GapContext.Provider>
    </div>,
  )
}

type CompoundedComponent = React.FC<GapProps> & {
  Compact: typeof Compact
}

const CompoundedGap = Gap as CompoundedComponent
CompoundedGap.Compact = Compact

export default CompoundedGap
