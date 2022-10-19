import type * as React from 'react'
import Group from './Group'
import type { InputProps, InputRef } from './Input'
import InternalInput from './Input'
import Search from './Search'

export { GroupProps } from './Group'
export { InputProps, InputRef } from './Input'
export { SearchProps } from './Search'

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputRef>> {
  Group: typeof Group
  Search: typeof Search
}

const Input = InternalInput as CompoundedComponent

Input.Group = Group
Input.Search = Search
export default Input
