import * as React from 'react'
import {
  InsertDriveFileOutlined, IndeterminateCheckBoxOutlined,
  AddBoxOutlined, ExpandMore,
} from '@mui/icons-material'
import classNames from 'classnames'
import Loading from '../../Loading'
import { cloneElement, isValidElement } from '../../utils/reactNode'
import type { MuiTreeNodeProps, TreeLeafIcon, SwitcherIcon } from '../Tree'

export default function renderSwitcherIcon(
  prefixCls: string,
  switcherIcon: SwitcherIcon,
  showLine: boolean | { showLeafIcon: boolean | TreeLeafIcon } | undefined,
  treeNodeProps: MuiTreeNodeProps,
): React.ReactNode {
  const { isLeaf, expanded, loading } = treeNodeProps

  if (loading) {
    return <Loading className={`${prefixCls}-switcher-loading-icon`} />
  }
  let showLeafIcon: boolean | TreeLeafIcon
  if (showLine && typeof showLine === 'object') {
    showLeafIcon = showLine.showLeafIcon
  }

  if (isLeaf) {
    if (!showLine) {
      return null
    }

    if (typeof showLeafIcon !== 'boolean' && !!showLeafIcon) {
      const leafIcon =
        typeof showLeafIcon === 'function' ? showLeafIcon(treeNodeProps) : showLeafIcon
      const leafCls = `${prefixCls}-switcher-line-custom-icon`

      if (isValidElement(leafIcon)) {
        return cloneElement(leafIcon, {
          className: classNames(leafIcon.props.className || '', leafCls),
        })
      }

      return leafIcon
    }

    return showLeafIcon ? (
      <InsertDriveFileOutlined className={`${prefixCls}-switcher-line-icon`} />
    ) : (
      <span className={`${prefixCls}-switcher-leaf-line`} />
    )
  }

  const switcherCls = `${prefixCls}-switcher-icon`

  const switcher = typeof switcherIcon === 'function' ? switcherIcon(treeNodeProps) : switcherIcon

  if (isValidElement(switcher)) {
    return cloneElement(switcher, {
      className: classNames(switcher.props.className || '', switcherCls),
    })
  }

  if (switcher) {
    return switcher
  }

  if (showLine) {
    return expanded ? (
      <IndeterminateCheckBoxOutlined className={`${prefixCls}-switcher-line-icon`} />
    ) : (
      <AddBoxOutlined className={`${prefixCls}-switcher-line-icon`} />
    )
  }
  return <ExpandMore className={switcherCls} />
}
