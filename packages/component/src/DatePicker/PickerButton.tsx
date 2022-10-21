import * as React from 'react'
import type { ButtonProps } from '../Button'
import Button from '../Button'

export default function PickerButton(props: ButtonProps) {
  return <Button size="small" type="primary" {...props} />
}
