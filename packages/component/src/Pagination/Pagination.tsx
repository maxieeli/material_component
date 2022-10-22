import * as React from 'react'
import classNames from 'classnames'
import {
  KeyboardArrowLeft, KeyboardArrowRight,
  KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight,
} from '@mui/icons-material'
import type {
  PaginationProps as BasicPaginationProps,
  PaginationLocale,
} from '@developerli/basic-pagination/es/types'
import BasicPagination from '@developerli/basic-pagination'
import enUS from '@developerli/basic-pagination/es/locale/en_US'
import { ConfigContext } from '../Provider'
import LocaleReceiver from '../LocaleProvider/LocaleReceiver'
import { MiddleSelect, MiniSelect } from './Select'
import useStyle from './styled'
import { IconButton } from '@mui/material'

export interface PaginationProps extends BasicPaginationProps {
  showQuickJumper?: boolean | { goButton?: React.ReactNode }
  size?: 'default' | 'small'
  responsive?: boolean
  role?: string
  totalBoundaryShowSizeChanger?: number
}

export type PaginationPosition = 'top' | 'bottom' | 'both'

export interface PaginationConfig extends PaginationProps {
  position?: PaginationPosition
}

export { PaginationLocale }

const Pagination: React.FC<PaginationProps> = ({
  prefixCls: customizePrefixCls,
  selectPrefixCls: customizeSelectPrefixCls,
  className,
  size,
  locale: customLocale,
  selectComponentClass,
  responsive,
  showSizeChanger,
  ...restProps
}) => {
  const { getPrefixCls, pagination = {} } = React.useContext(ConfigContext)
  const prefixCls = getPrefixCls('pagination', customizePrefixCls)

  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const mergedShowSizeChanger = showSizeChanger ?? pagination.showSizeChanger

  const getIconsProps = () => {
    const ellipsis = <span className={`${prefixCls}-item-ellipsis`}>•••</span>
    let prevIcon = (
      <IconButton className={`${prefixCls}-item-link`} type='button' tabIndex={-1}>
        <KeyboardArrowLeft />
      </IconButton>
    )
    let nextIcon = (
      <IconButton className={`${prefixCls}-item-link`} type='button' tabIndex={-1}>
        <KeyboardArrowRight />
      </IconButton>
    )
    let jumpPrevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <KeyboardDoubleArrowLeft className={`${prefixCls}-item-link-icon`} />
          {ellipsis}
        </div>
      </a>
    )
    let jumpNextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <div className={`${prefixCls}-item-container`}>
          <KeyboardDoubleArrowRight className={`${prefixCls}-item-link-icon`} />
          {ellipsis}
        </div>
      </a>
    )
    return {
      prevIcon,
      nextIcon,
      jumpPrevIcon,
      jumpNextIcon,
    }
  }

  return (
    <LocaleReceiver componentName='Pagination' defaultLocale={enUS}>
      {contextLocale => {
        const locale = { ...contextLocale, ...customLocale }
        const isSmall = size === 'small' || !!(!size && responsive)
        const selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls)
        const extendedClassName = classNames(
          { [`${prefixCls}-mini`]: isSmall },
          className,
          hashId,
        )

        return wrapSSR(
          <BasicPagination
            {...getIconsProps()}
            {...restProps}
            prefixCls={prefixCls}
            selectPrefixCls={selectPrefixCls}
            className={extendedClassName}
            selectComponentClass={selectComponentClass || (isSmall ? MiniSelect : MiddleSelect)}
            locale={locale}
            showSizeChanger={mergedShowSizeChanger}
          />,
        )
      }}
    </LocaleReceiver>
  )
}

export default Pagination
