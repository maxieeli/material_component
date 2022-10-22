import type {
  ColumnType as RcColumnType,
  FixedType,
  RenderedCell as RcRenderedCell,
} from '@developerli/basic-table/es/interface'
import { ExpandableConfig, GetRowKey } from '@developerli/basic-table/es/interface'
import type * as React from 'react'
import type { CheckboxProps } from '../Checkbox'
import type { PaginationProps } from '../Pagination'
import type { TooltipProps } from '../Tooltip'
import type { Breakpoint } from '../utils/responsiveObserve'
import { tuple } from '../utils/type'
import type { INTERNAL_SELECTION_ITEM } from './hooks/useSelection'

export { GetRowKey, ExpandableConfig }
export type Key = React.Key
export type RowSelectionType = 'checkbox' | 'radio'
export type SelectionItemSelectFn = (currentRowKeys: Array<Key>) => void
export type ExpandType = null | 'row' | 'nest'

export interface TableLocale {
  filterTitle?: string
  filterConfirm?: React.ReactNode
  filterReset?: React.ReactNode
  filterEmptyText?: React.ReactNode
  filterCheckall?: React.ReactNode
  filterSearchPlaceholder?: string
  emptyText?: React.ReactNode | (() => React.ReactNode)
  selectAll?: React.ReactNode
  selectNone?: React.ReactNode
  selectInvert?: React.ReactNode
  selectionAll?: React.ReactNode
  sortTitle?: string
  expand?: string
  collapse?: string
  triggerDesc?: string
  triggerAsc?: string
  cancelSort?: string
}

export type SortOrder = 'descend' | 'ascend' | null

const TableActions = tuple('paginate', 'sort', 'filter')
export type TableAction = typeof TableActions[number]

export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number

export interface ColumnFilterItem {
  text: React.ReactNode
  value: string | number | boolean
  children?: Array<ColumnFilterItem>
}

export interface ColumnTitleProps<RecordType> {
  sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[]
  filters?: Record<string, FilterValue>
}

export type ColumnTitle<RecordType> =
  | React.ReactNode
  | ((props: ColumnTitleProps<RecordType>) => React.ReactNode)

export type FilterValue = Array<(Key | boolean)>
export type FilterKey = Array<Key> | null
export type FilterSearchType<RecordType = Record<string, any>> =
  | boolean
  | ((input: string, record: RecordType) => boolean)
export interface FilterConfirmProps {
  closeDropdown: boolean
}

export interface FilterDropdownProps {
  prefixCls: string
  setSelectedKeys: (selectedKeys: Array<React.Key>) => void
  selectedKeys: Array<React.Key>
  confirm: (param?: FilterConfirmProps) => void
  clearFilters?: () => void
  filters?: Array<ColumnFilterItem>
  close: () => void
  visible: boolean
}

export interface ColumnType<RecordType> extends Omit<RcColumnType<RecordType>, 'title'> {
  title?: ColumnTitle<RecordType>
  // Sorter
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
        compare?: CompareFn<RecordType>
        multiple?: number
      }
  sortOrder?: SortOrder
  defaultSortOrder?: SortOrder
  sortDirections?: Array<SortOrder>
  showSorterTooltip?: boolean | TooltipProps

  // Filter
  filtered?: boolean
  filters?: Array<ColumnFilterItem>
  filterDropdown?: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode)
  filterMultiple?: boolean
  filteredValue?: FilterValue | null
  defaultFilteredValue?: FilterValue | null
  filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode)
  filterMode?: 'menu' | 'tree'
  filterSearch?: FilterSearchType<ColumnFilterItem>
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean
  filterDropdownOpen?: boolean
  onFilterDropdownOpenChange?: (visible: boolean) => void
  filterResetToDefaultFilteredValue?: boolean
  // Responsive
  responsive?: Array<Breakpoint>
}

export interface ColumnGroupType<RecordType> extends Omit<ColumnType<RecordType>, 'dataIndex'> {
  children: ColumnsType<RecordType>
}

export type ColumnsType<RecordType = unknown> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[]

export interface SelectionItem {
  key: string
  text: React.ReactNode
  onSelect?: SelectionItemSelectFn
}

export type SelectionSelectFn<T> = (
  record: T,
  selected: boolean,
  selectedRows: Array<T>,
  nativeEvent: Event,
) => void

export type RowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple'

export interface TableRowSelection<T> {
  /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
  preserveSelectedRowKeys?: boolean
  type?: RowSelectionType
  selectedRowKeys?: Array<Key>
  defaultSelectedRowKeys?: Array<Key>
  onChange?: (selectedRowKeys: Array<Key>, selectedRows: Array<T>, info: { type: RowSelectMethod }) => void
  getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>
  onSelect?: SelectionSelectFn<T>
  onSelectNone?: () => void
  selections?: Array<INTERNAL_SELECTION_ITEM> | boolean
  hideSelectAll?: boolean
  fixed?: FixedType
  columnWidth?: string | number
  columnTitle?: string | React.ReactNode
  checkStrictly?: boolean
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: React.ReactNode,
  ) => React.ReactNode | RcRenderedCell<T>
}

export type TransformColumns<RecordType> = (
  columns: ColumnsType<RecordType>,
) => ColumnsType<RecordType>

export interface TableCurrentDataSource<RecordType> {
  currentDataSource: Array<RecordType>
  action: TableAction
}

export interface SorterResult<RecordType> {
  column?: ColumnType<RecordType>
  order?: SortOrder
  field?: Key | readonly Key[]
  columnKey?: Key
}

export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement

type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'

export interface TablePaginationConfig extends PaginationProps {
  position?: Array<TablePaginationPosition>
}
