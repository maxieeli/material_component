import * as React from 'react'
import type { ConfigConsumerProps } from '.'
import { ConfigConsumer } from '.'
import Empty from '../Empty/NoData'

const defaultRenderEmpty = (componentName?: string): React.ReactNode => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const prefix = getPrefixCls('empty')

      switch (componentName) {
        case 'Table':
          return <Empty />
        case 'Select':
        case 'Cascader':
        default:
          return <div style={{ margin: '10px' }}>No Data</div>
      }
    }}
  </ConfigConsumer>
)

export type RenderEmptyHandler = typeof defaultRenderEmpty

export default defaultRenderEmpty
