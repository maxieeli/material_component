import { useContext } from 'react'
import type { ValidateStatus } from '../FormItem'
import { FormItemInputContext } from '../context'

type UseFormItemStatus = () => {
  status?: ValidateStatus
}

const useFormItemStatus: UseFormItemStatus = () => {
  const { status } = useContext(FormItemInputContext)
  return { status }
}

(useFormItemStatus as any).Context = FormItemInputContext

export default useFormItemStatus
