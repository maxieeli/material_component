import * as React from 'react'
import { Chip, ChipProps } from '@mui/material'

export default function PickerTag(props: ChipProps) {
  return (
    <Chip
      color='primary'
      size='small'
      label={props.children}
      style={{ backgroundColor: '#2E41B6'}}
      {...props}
    />
  )
}
