import {FieldArrayRenderProps} from 'formik'
import * as React from 'react'
import {Tag, VARIANT} from 'baseui/tag'

export function renderTagList(list: string[], arrayHelpers: FieldArrayRenderProps) {
  return (
    <React.Fragment>
      {list && list.length > 0
        ? list.map((item, index) => (
            <React.Fragment key={index}>
              {item ? (
                <Tag
                  key={item}
                  variant={VARIANT.outlined}
                  onActionClick={() => arrayHelpers.remove(index)}
                  overrides={{
                    Text: {
                      style: {
                        maxWidth: '550px',
                      },
                    },
                  }}
                >
                  {item}
                </Tag>
              ) : null}
            </React.Fragment>
          ))
        : null}
    </React.Fragment>
  )
}
