import * as React from 'react'
import classNames from 'classnames'
import {
  InsertDriveFileOutlined,
  FileOpenOutlined,
  FolderOutlined,
} from '@mui/icons-material'
import type RcTree from '@developerli/basic-tree'
import type { BasicDataNode } from '@developerli/basic-tree'
import type { DataNode, EventDataNode, Key } from '@developerli/basic-tree/es/interface'
import { conductExpandParent } from '@developerli/basic-tree/es/util'
import { convertDataToEntities, convertTreeToData } from '@developerli/basic-tree/es/utils/treeUtil'
import { ConfigContext } from '../Provider'

import type { MuiTreeNodeAttribute, TreeProps } from './Tree'
import Tree from './Tree'
import { calcRangeKeys, convertDirectoryKeysToNodes } from './utils/dictUtil'

export type ExpandAction = false | 'click' | 'doubleClick'

export interface DirectoryTreeProps<T extends BasicDataNode = DataNode> extends TreeProps<T> {
  expandAction?: ExpandAction
}

type DirectoryTreeCompoundedComponent = (<T extends BasicDataNode | DataNode = DataNode>(
  props: React.PropsWithChildren<DirectoryTreeProps<T>> & { ref?: React.Ref<RcTree> },
) => React.ReactElement) & {
  defaultProps: Partial<React.PropsWithChildren<DirectoryTreeProps<any>>>
  displayName?: string
}

export interface DirectoryTreeState {
  expandedKeys?: Key[]
  selectedKeys?: Key[]
}

function getIcon(props: MuiTreeNodeAttribute): React.ReactNode {
  const { isLeaf, expanded } = props
  if (isLeaf) {
    return <InsertDriveFileOutlined />
  }
  return expanded ? <FileOpenOutlined /> : <FolderOutlined />
}

function getTreeData({ treeData, children }: DirectoryTreeProps) {
  return treeData || convertTreeToData(children)
}

const DirectoryTree: React.ForwardRefRenderFunction<RcTree, DirectoryTreeProps> = (
  { defaultExpandAll, defaultExpandParent, defaultExpandedKeys, ...props },
  ref,
) => {
  // Shift click usage
  const lastSelectedKey = React.useRef<Key>()

  const cachedSelectedKeys = React.useRef<Key[]>()

  const treeRef = React.createRef<RcTree>()

  React.useImperativeHandle(ref, () => treeRef.current!)

  const getInitExpandedKeys = () => {
    const { keyEntities } = convertDataToEntities(getTreeData(props))

    let initExpandedKeys: Key[]

    // Expanded keys
    if (defaultExpandAll) {
      initExpandedKeys = Object.keys(keyEntities)
    } else if (defaultExpandParent) {
      initExpandedKeys = conductExpandParent(
        props.expandedKeys || defaultExpandedKeys || [],
        keyEntities,
      )
    } else {
      initExpandedKeys = (props.expandedKeys || defaultExpandedKeys)!
    }
    return initExpandedKeys
  }

  const [selectedKeys, setSelectedKeys] = React.useState(
    props.selectedKeys || props.defaultSelectedKeys || [],
  )
  const [expandedKeys, setExpandedKeys] = React.useState(() => getInitExpandedKeys())

  React.useEffect(() => {
    if ('selectedKeys' in props) {
      setSelectedKeys(props.selectedKeys!)
    }
  }, [props.selectedKeys])

  React.useEffect(() => {
    if ('expandedKeys' in props) {
      setExpandedKeys(props.expandedKeys!)
    }
  }, [props.expandedKeys])

  const onExpand = (
    keys: Key[],
    info: {
      node: EventDataNode<any>
      expanded: boolean
      nativeEvent: MouseEvent
    },
  ) => {
    if (!('expandedKeys' in props)) {
      setExpandedKeys(keys)
    }
    // Call origin function
    return props.onExpand?.(keys, info)
  }

  const onSelect = (
    keys: Key[],
    event: {
      event: 'select'
      selected: boolean
      node: any
      selectedNodes: DataNode[]
      nativeEvent: MouseEvent
    },
  ) => {
    const { multiple } = props
    const { node, nativeEvent } = event
    const { key = '' } = node

    const treeData = getTreeData(props)
    const newEvent: any = {
      ...event,
      selected: true, // Directory selected always true
    }

    const ctrlPick: boolean = nativeEvent?.ctrlKey || nativeEvent?.metaKey
    const shiftPick: boolean = nativeEvent?.shiftKey

    // Generate new selected keys
    let newSelectedKeys: Key[]
    if (multiple && ctrlPick) {
      // Control click
      newSelectedKeys = keys
      lastSelectedKey.current = key
      cachedSelectedKeys.current = newSelectedKeys
      newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys)
    } else if (multiple && shiftPick) {
      // Shift click
      newSelectedKeys = Array.from(
        new Set([
          ...(cachedSelectedKeys.current || []),
          ...calcRangeKeys({
            treeData,
            expandedKeys,
            startKey: key,
            endKey: lastSelectedKey.current,
          }),
        ]),
      )
      newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys)
    } else {
      // Single click
      newSelectedKeys = [key]
      lastSelectedKey.current = key
      cachedSelectedKeys.current = newSelectedKeys
      newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData, newSelectedKeys)
    }

    props.onSelect?.(newSelectedKeys, newEvent)
    if (!('selectedKeys' in props)) {
      setSelectedKeys(newSelectedKeys)
    }
  }
  const { getPrefixCls } = React.useContext(ConfigContext)

  const {
    prefixCls: customizePrefixCls,
    className,
    showIcon = true,
    expandAction = 'click',
    ...otherProps
  } = props

  const prefixCls = getPrefixCls('tree', customizePrefixCls)
  const connectClassName = classNames(
    `${prefixCls}-directory`,
    className,
  )

  return (
    <Tree
      icon={getIcon}
      ref={treeRef}
      blockNode
      {...otherProps}
      showIcon={showIcon}
      expandAction={expandAction}
      prefixCls={prefixCls}
      className={connectClassName}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      onExpand={onExpand}
    />
  )
}

const ForwardDirectoryTree = React.forwardRef(
  DirectoryTree,
) as unknown as DirectoryTreeCompoundedComponent

if (process.env.NODE_ENV !== 'production') {
  ForwardDirectoryTree.displayName = 'DirectoryTree'
}

export default ForwardDirectoryTree
