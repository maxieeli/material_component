import type { ColumnType } from './interface'

export interface ColumnProps<RecordType> extends ColumnType<RecordType> {
  children?: null
}

// @ts-ignore
function Column<RecordType>(_: ColumnProps<RecordType>) {
  return null
}

export default Column
