import { Chips } from '@navikt/ds-react'
import { FieldArrayRenderProps } from 'formik'
import { Fragment } from 'react/jsx-runtime'

export function renderTagList(list: string[], arrayHelpers: FieldArrayRenderProps) {
  return (
    <Fragment>
      {list && list.length > 0
        ? list.map((item: string, index: number) => (
            <Fragment key={index}>
              {item ? (
                <Chips.Removable key={item} onClick={() => arrayHelpers.remove(index)}>
                  {item}
                </Chips.Removable>
              ) : null}
            </Fragment>
          ))
        : null}
    </Fragment>
  )
}
