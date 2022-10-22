import type * as React from 'react'
import type { ColumnProps } from './Column'
import type { ColumnType } from './interface'

export interface ColumnGroupProps<RecordType> extends Omit<ColumnType<RecordType>, 'children'> {
  children:
    | React.ReactElement<ColumnProps<RecordType>>
    | React.ReactElement<ColumnProps<RecordType>>[]
}

// @ts-ignore
function ColumnGroup<RecordType>(_: ColumnGroupProps<RecordType>) {
  return null
}

export default ColumnGroup
