import { Tag, VARIANT } from 'baseui/tag'
import { FieldArrayRenderProps } from 'formik'
import { Fragment } from 'react/jsx-runtime'

export function renderTagList(list: string[], arrayHelpers: FieldArrayRenderProps) {
  return (
    <Fragment>
      {list && list.length > 0
        ? list.map((item: string, index: number) => (
            <Fragment key={index}>
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
            </Fragment>
          ))
        : null}
    </Fragment>
  )
}
