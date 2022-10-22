import * as React from 'react'
import { TextField, InputAdornment } from '@mui/material'
import { Search } from '@mui/icons-material'
import type { FilterSearchType, TableLocale } from '../../interface'

interface FilterSearchProps<RecordType = any> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  filterSearch: FilterSearchType<RecordType>
  tablePrefixCls: string
  locale: TableLocale
}

function FilterSearch<RecordType>({
  value,
  onChange,
  filterSearch,
  tablePrefixCls,
  locale,
}: FilterSearchProps<RecordType>) {
  if (!filterSearch) {
    return null
  }
  return (
    <div className={`${tablePrefixCls}-filter-dropdown-search`}>
      <TextField
        size='small'
        label='search'
        fullWidth
        placeholder={locale.filterSearchPlaceholder}
        onChange={onChange}
        value={value}
        className={`${tablePrefixCls}-filter-dropdown-search-input`}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          )
        }}
      />
    </div>
  )
}

export default FilterSearch
