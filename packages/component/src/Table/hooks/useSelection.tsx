import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Radio } from '@mui/material'
import { INTERNAL_COL_DEFINE } from '@developerli/basic-table'
import type { DataNode, GetCheckDisabled } from '@developerli/basic-tree/es/interface'
import { arrAdd, arrDel } from '@developerli/basic-tree/es/util'
import { conductCheck } from '@developerli/basic-tree/es/utils/conductUtil'
import { convertDataToEntities } from '@developerli/basic-tree/es/utils/treeUtil'
import useMergedState from 'rc-util/lib/hooks/useMergedState'
import type { CheckboxProps } from '../../Checkbox'
import Checkbox from '../../Checkbox'
import Dropdown from '../../Dropdown'
import Menu from '../../Menu'
import type {
  ColumnsType,
  ColumnType,
  ExpandType,
  GetPopupContainer,
  GetRowKey,
  Key,
  RowSelectMethod,
  SelectionItem,
  TableLocale,
  TableRowSelection,
  TransformColumns,
} from '../interface'

export type FixedType = 'left' | 'right' | boolean
export const SELECTION_COLUMN = {} as const
export const SELECTION_ALL = 'SELECT_ALL' as const
export const SELECTION_INVERT = 'SELECT_INVERT' as const
export const SELECTION_NONE = 'SELECT_NONE' as const

const EMPTY_LIST: React.Key[] = []

interface UseSelectionConfig<RecordType> {
  prefixCls: string
  pageData: Array<RecordType>
  data: Array<RecordType>
  getRowKey: GetRowKey<RecordType>
  getRecordByKey: (key: Key) => RecordType
  expandType: ExpandType
  childrenColumnName: string
  locale: TableLocale
  getPopupContainer?: GetPopupContainer
}

export type INTERNAL_SELECTION_ITEM =
  | SelectionItem
  | typeof SELECTION_ALL
  | typeof SELECTION_INVERT
  | typeof SELECTION_NONE

function flattenData<RecordType>(
  data: Array<RecordType> | undefined,
  childrenColumnName: string,
): Array<RecordType> {
  let list: Array<RecordType> = [];
  (data || []).forEach(record => {
    list.push(record)

    if (record && typeof record === 'object' && childrenColumnName in record) {
      list = [
        ...list,
        ...flattenData<RecordType>((record as any)[childrenColumnName], childrenColumnName),
      ]
    }
  })

  return list
}

export default function useSelection<RecordType>(
  rowSelection: TableRowSelection<RecordType> | undefined,
  config: UseSelectionConfig<RecordType>,
): [TransformColumns<RecordType>, Set<Key>] {
  const {
    preserveSelectedRowKeys,
    selectedRowKeys,
    defaultSelectedRowKeys,
    getCheckboxProps,
    onChange: onSelectionChange,
    onSelect,
    onSelectNone,
    columnWidth: selectionColWidth,
    type: selectionType,
    selections,
    fixed,
    renderCell: customizeRenderCell,
    hideSelectAll,
    checkStrictly = true,
  } = rowSelection || {}

  const {
    prefixCls,
    data,
    pageData,
    getRecordByKey,
    getRowKey,
    expandType,
    childrenColumnName,
    locale: tableLocale,
    getPopupContainer,
  } = config

  // ========================= Keys =========================
  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
    selectedRowKeys || defaultSelectedRowKeys || EMPTY_LIST,
    {
      value: selectedRowKeys,
    },
  )

  // ======================== Caches ========================
  const preserveRecordsRef = React.useRef(new Map<Key, RecordType>())

  const updatePreserveRecordsCache = useCallback(
    (keys: Array<Key>) => {
      if (preserveSelectedRowKeys) {
        const newCache = new Map<Key, RecordType>()
        // Keep key if mark as preserveSelectedRowKeys
        keys.forEach(key => {
          let record = getRecordByKey(key)

          if (!record && preserveRecordsRef.current.has(key)) {
            record = preserveRecordsRef.current.get(key)!
          }

          newCache.set(key, record)
        })
        // Refresh to new cache
        preserveRecordsRef.current = newCache
      }
    },
    [getRecordByKey, preserveSelectedRowKeys],
  )

  // Update cache with selectedKeys
  React.useEffect(() => {
    updatePreserveRecordsCache(mergedSelectedKeys)
  }, [mergedSelectedKeys])

  const { keyEntities } = useMemo(
    () =>
      checkStrictly
        ? { keyEntities: null }
        : convertDataToEntities(data as unknown as DataNode[], {
            externalGetKey: getRowKey as any,
            childrenPropName: childrenColumnName,
          }),
    [data, getRowKey, checkStrictly, childrenColumnName],
  )

  // Get flatten data
  const flattedData = useMemo(
    () => flattenData(pageData, childrenColumnName),
    [pageData, childrenColumnName],
  )

  // Get all checkbox props
  const checkboxPropsMap = useMemo(() => {
    const map = new Map<Key, Partial<CheckboxProps>>()
    flattedData.forEach((record, index) => {
      const key = getRowKey(record, index)
      const checkboxProps = (getCheckboxProps ? getCheckboxProps(record) : null) || {}
      map.set(key, checkboxProps)
    })
    return map
  }, [flattedData, getRowKey, getCheckboxProps])

  const isCheckboxDisabled: GetCheckDisabled<RecordType> = useCallback(
    (r: RecordType) => !!checkboxPropsMap.get(getRowKey(r))?.disabled,
    [checkboxPropsMap, getRowKey],
  )

  const [derivedSelectedKeys, derivedHalfSelectedKeys] = useMemo(() => {
    if (checkStrictly) {
      return [mergedSelectedKeys || [], []]
    }
    const { checkedKeys, halfCheckedKeys } = conductCheck(
      mergedSelectedKeys,
      true,
      keyEntities as any,
      isCheckboxDisabled as any,
    )
    return [checkedKeys || [], halfCheckedKeys]
  }, [mergedSelectedKeys, checkStrictly, keyEntities, isCheckboxDisabled])

  const derivedSelectedKeySet: Set<Key> = useMemo(() => {
    const keys = selectionType === 'radio' ? derivedSelectedKeys.slice(0, 1) : derivedSelectedKeys
    return new Set(keys)
  }, [derivedSelectedKeys, selectionType])
  const derivedHalfSelectedKeySet = useMemo(
    () => (selectionType === 'radio' ? new Set() : new Set(derivedHalfSelectedKeys)),
    [derivedHalfSelectedKeys, selectionType],
  )

  // Save last selected key to enable range selection
  const [lastSelectedKey, setLastSelectedKey] = useState<Key | null>(null)

  // Reset if rowSelection reset
  React.useEffect(() => {
    if (!rowSelection) {
      setMergedSelectedKeys(EMPTY_LIST)
    }
  }, [!!rowSelection])

  const setSelectedKeys = useCallback(
    (keys: Array<Key>, method: RowSelectMethod) => {
      let availableKeys: Array<Key>
      let records: Array<RecordType>

      updatePreserveRecordsCache(keys)

      if (preserveSelectedRowKeys) {
        availableKeys = keys
        records = keys.map(key => preserveRecordsRef.current.get(key)!)
      } else {
        // Filter key which not exist in the `dataSource`
        availableKeys = []
        records = []

        keys.forEach(key => {
          const record = getRecordByKey(key)
          if (record !== undefined) {
            availableKeys.push(key)
            records.push(record)
          }
        })
      }

      setMergedSelectedKeys(availableKeys)

      onSelectionChange?.(availableKeys, records, { type: method })
    },
    [setMergedSelectedKeys, getRecordByKey, onSelectionChange, preserveSelectedRowKeys],
  )

  // ====================== Selections ======================
  // Trigger single `onSelect` event
  const triggerSingleSelection = useCallback(
    (key: Key, selected: boolean, keys: Array<Key>, event: Event) => {
      if (onSelect) {
        const rows = keys.map(k => getRecordByKey(k))
        onSelect(getRecordByKey(key), selected, rows, event)
      }

      setSelectedKeys(keys, 'single')
    },
    [onSelect, getRecordByKey, setSelectedKeys],
  )

  const mergedSelections = useMemo<SelectionItem[] | null>(() => {
    if (!selections || hideSelectAll) {
      return null
    }

    const selectionList: Array<INTERNAL_SELECTION_ITEM> =
      selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections

    return selectionList
      .map((selection: INTERNAL_SELECTION_ITEM) => {
        if (selection === SELECTION_ALL) {
          return {
            key: 'all',
            text: tableLocale.selectionAll,
            onSelect() {
              setSelectedKeys(
                data
                  .map((record, index) => getRowKey(record, index))
                  .filter(key => {
                    const checkProps = checkboxPropsMap.get(key)
                    return !checkProps?.disabled || derivedSelectedKeySet.has(key)
                  }),
                'all',
              )
            },
          }
        }
        if (selection === SELECTION_INVERT) {
          return {
            key: 'invert',
            text: tableLocale.selectInvert,
            onSelect() {
              const keySet = new Set(derivedSelectedKeySet)
              pageData.forEach((record, index) => {
                const key = getRowKey(record, index)
                const checkProps = checkboxPropsMap.get(key)

                if (!checkProps?.disabled) {
                  if (keySet.has(key)) {
                    keySet.delete(key)
                  } else {
                    keySet.add(key)
                  }
                }
              })

              const keys = Array.from(keySet)
              setSelectedKeys(keys, 'invert')
            },
          }
        }
        if (selection === SELECTION_NONE) {
          return {
            key: 'none',
            text: tableLocale.selectNone,
            onSelect() {
              onSelectNone?.()
              setSelectedKeys(
                Array.from(derivedSelectedKeySet).filter(key => {
                  const checkProps = checkboxPropsMap.get(key)
                  return checkProps?.disabled
                }),
                'none',
              )
            },
          }
        }
        return selection as SelectionItem
      })
      .map(selection => ({
        ...selection,
        onSelect: (...rest) => {
          selection.onSelect?.(...rest)
          setLastSelectedKey(null)
        },
      }))
  }, [selections, derivedSelectedKeySet, pageData, getRowKey, setSelectedKeys])

  // ======================= Columns ========================
  const transformColumns = useCallback(
    (columns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      if (!rowSelection) {
        return columns.filter(col => col !== SELECTION_COLUMN)
      }

      // >>>>>>>>>>> Support selection
      let cloneColumns = [...columns]
      const keySet = new Set(derivedSelectedKeySet)

      // Record key only need check with enabled
      const recordKeys = flattedData
        .map(getRowKey)
        .filter(key => !checkboxPropsMap.get(key)!.disabled)
      const checkedCurrentAll = recordKeys.every(key => keySet.has(key))
      const checkedCurrentSome = recordKeys.some(key => keySet.has(key))

      const onSelectAllChange = () => {
        const changeKeys: Array<Key> = []

        if (checkedCurrentAll) {
          recordKeys.forEach(key => {
            keySet.delete(key)
            changeKeys.push(key)
          })
        } else {
          recordKeys.forEach(key => {
            if (!keySet.has(key)) {
              keySet.add(key)
              changeKeys.push(key)
            }
          })
        }

        const keys = Array.from(keySet)

        setSelectedKeys(keys, 'all')
        setLastSelectedKey(null)
      }

      // ===================== Render =====================
      // Title Cell
      let title: React.ReactNode
      if (selectionType !== 'radio') {
        let customizeSelections: React.ReactNode
        if (mergedSelections) {
          const menu = (
            <Menu
              getPopupContainer={getPopupContainer}
              items={mergedSelections.map((selection, index) => {
                const { key, text, onSelect: onSelectionClick } = selection

                return {
                  key: key || index,
                  onClick: () => {
                    onSelectionClick?.(recordKeys)
                  },
                  label: text,
                }
              })}
            />
          )
          customizeSelections = (
            <div className={`${prefixCls}-selection-extra`}>
              <Dropdown overlay={menu} getPopupContainer={getPopupContainer}>
                <span>
                  <KeyboardArrowDown />
                </span>
              </Dropdown>
            </div>
          )
        }

        const allDisabledData = flattedData
          .map((record, index) => {
            const key = getRowKey(record, index)
            const checkboxProps = checkboxPropsMap.get(key) || {}
            return { checked: keySet.has(key), ...checkboxProps }
          })
          .filter(({ disabled }) => disabled)

        const allDisabled =
          !!allDisabledData.length && allDisabledData.length === flattedData.length

        const allDisabledAndChecked =
          allDisabled && allDisabledData.every(({ checked }) => checked)
        const allDisabledSomeChecked =
          allDisabled && allDisabledData.some(({ checked }) => checked)

        title = !hideSelectAll && (
          <div className={`${prefixCls}-selection`}>
            <Checkbox
              checked={
                !allDisabled ? !!flattedData.length && checkedCurrentAll : allDisabledAndChecked
              }
              indeterminate={
                !allDisabled
                  ? !checkedCurrentAll && checkedCurrentSome
                  : !allDisabledAndChecked && allDisabledSomeChecked
              }
              onChange={onSelectAllChange}
              disabled={flattedData.length === 0 || allDisabled}
              skipGroup
            />
            {customizeSelections}
          </div>
        )
      }

      // Body Cell
      let renderCell: (
        _: RecordType,
        record: RecordType,
        index: number,
      ) => { node: React.ReactNode; checked: boolean }
      if (selectionType === 'radio') {
        renderCell = (_, record, index) => {
          const key = getRowKey(record, index)
          const checked = keySet.has(key)

          return {
            node: (
              <Radio
                {...checkboxPropsMap.get(key)}
                checked={checked}
                onClick={e => e.stopPropagation()}
                onChange={event => {
                  if (!keySet.has(key)) {
                    triggerSingleSelection(key, true, [key], event.nativeEvent)
                  }
                }}
              />
            ),
            checked,
          }
        }
      } else {
        renderCell = (_, record, index) => {
          const key = getRowKey(record, index)
          const checked = keySet.has(key)
          const indeterminate = derivedHalfSelectedKeySet.has(key)
          const checkboxProps = checkboxPropsMap.get(key)
          let mergedIndeterminate: boolean
          if (expandType === 'nest') {
            mergedIndeterminate = indeterminate
          } else {
            mergedIndeterminate = checkboxProps?.indeterminate ?? indeterminate
          }
          // Record checked
          return {
            node: (
              <Checkbox
                {...checkboxProps}
                indeterminate={mergedIndeterminate}
                checked={checked}
                skipGroup
                onClick={e => e.stopPropagation()}
                onChange={({ nativeEvent }) => {
                  const { shiftKey } = nativeEvent

                  let startIndex: number = -1
                  let endIndex: number = -1

                  // Get range of this
                  if (shiftKey && checkStrictly) {
                    const pointKeys = new Set([lastSelectedKey, key])

                    recordKeys.some((recordKey, recordIndex) => {
                      if (pointKeys.has(recordKey)) {
                        if (startIndex === -1) {
                          startIndex = recordIndex
                        } else {
                          endIndex = recordIndex
                          return true
                        }
                      }

                      return false
                    })
                  }

                  if (endIndex !== -1 && startIndex !== endIndex && checkStrictly) {
                    // Batch update selections
                    const rangeKeys = recordKeys.slice(startIndex, endIndex + 1)
                    const changedKeys: Array<Key> = []

                    if (checked) {
                      rangeKeys.forEach(recordKey => {
                        if (keySet.has(recordKey)) {
                          changedKeys.push(recordKey)
                          keySet.delete(recordKey)
                        }
                      })
                    } else {
                      rangeKeys.forEach(recordKey => {
                        if (!keySet.has(recordKey)) {
                          changedKeys.push(recordKey)
                          keySet.add(recordKey)
                        }
                      })
                    }

                    const keys = Array.from(keySet)
                    setSelectedKeys(keys, 'multiple')
                  } else {
                    // Single record selected
                    const originCheckedKeys = derivedSelectedKeys
                    if (checkStrictly) {
                      const checkedKeys = checked
                        ? arrDel(originCheckedKeys, key)
                        : arrAdd(originCheckedKeys, key)
                      triggerSingleSelection(key, !checked, checkedKeys, nativeEvent)
                    } else {
                      // Always fill first
                      const result = conductCheck(
                        [...originCheckedKeys, key],
                        true,
                        keyEntities as any,
                        isCheckboxDisabled as any,
                      )
                      const { checkedKeys, halfCheckedKeys } = result
                      let nextCheckedKeys = checkedKeys

                      // If remove, we do it again to correction
                      if (checked) {
                        const tempKeySet = new Set(checkedKeys)
                        tempKeySet.delete(key)
                        nextCheckedKeys = conductCheck(
                          Array.from(tempKeySet),
                          { checked: false, halfCheckedKeys },
                          keyEntities as any,
                          isCheckboxDisabled as any,
                        ).checkedKeys
                      }

                      triggerSingleSelection(key, !checked, nextCheckedKeys, nativeEvent)
                    }
                  }

                  if (checked) {
                    setLastSelectedKey(null)
                  } else {
                    setLastSelectedKey(key)
                  }
                }}
              />
            ),
            checked,
          }
        }
      }

      const renderSelectionCell = (_: any, record: RecordType, index: number) => {
        const { node, checked } = renderCell(_, record, index)

        if (customizeRenderCell) {
          return customizeRenderCell(checked, record, index, node)
        }

        return node
      }

      // Insert selection column if not exist
      if (!cloneColumns.includes(SELECTION_COLUMN)) {
        // Always after expand icon
        if (
          cloneColumns.findIndex(
            (col: any) => col[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN',
          ) === 0
        ) {
          const [expandColumn, ...restColumns] = cloneColumns
          cloneColumns = [expandColumn, SELECTION_COLUMN, ...restColumns]
        } else {
          // Normal insert at first column
          cloneColumns = [SELECTION_COLUMN, ...cloneColumns]
        }
      }
      // Deduplicate selection column
      const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN)

      cloneColumns = cloneColumns.filter(
        (column, index) => column !== SELECTION_COLUMN || index === selectionColumnIndex,
      )

      // Fixed column logic
      const prevCol: ColumnType<RecordType> & Record<string, any> =
        cloneColumns[selectionColumnIndex - 1]
      const nextCol: ColumnType<RecordType> & Record<string, any> =
        cloneColumns[selectionColumnIndex + 1]

      let mergedFixed: FixedType | undefined = fixed

      if (mergedFixed === undefined) {
        if (nextCol?.fixed !== undefined) {
          mergedFixed = nextCol.fixed
        } else if (prevCol?.fixed !== undefined) {
          mergedFixed = prevCol.fixed
        }
      }

      if (
        mergedFixed &&
        prevCol &&
        prevCol[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN' &&
        prevCol.fixed === undefined
      ) {
        prevCol.fixed = mergedFixed
      }

      // Replace with real selection column
      const selectionColumn = {
        fixed: mergedFixed,
        width: selectionColWidth,
        className: `${prefixCls}-selection-column`,
        title: rowSelection.columnTitle || title,
        render: renderSelectionCell,
        [INTERNAL_COL_DEFINE]: {
          className: `${prefixCls}-selection-col`,
        },
      }

      return cloneColumns.map(col => (col === SELECTION_COLUMN ? selectionColumn : col))
    },
    [
      getRowKey,
      flattedData,
      rowSelection,
      derivedSelectedKeys,
      derivedSelectedKeySet,
      derivedHalfSelectedKeySet,
      selectionColWidth,
      mergedSelections,
      expandType,
      lastSelectedKey,
      checkboxPropsMap,
      triggerSingleSelection,
      isCheckboxDisabled,
    ],
  )

  return [transformColumns, derivedSelectedKeySet]
}
