import { PlusIcon, TrashIcon } from '@navikt/aksel-icons'
import { Table } from '@navikt/ds-react'
import { FieldArrayRenderProps } from 'formik'
import { Fragment, useEffect, useState } from 'react'
import shortid from 'shortid'
import { IDocumentInfoTypeUse, IDocumentInformationTypes } from '../../../constants'
import { ICodelistProps } from '../../../service/Codelist'
import Button from '../../common/Button/CustomButton'
import { Error } from '../../common/ModalSchema'
import FieldInformationType from './FieldInformationType'
import FieldSubjectCategory from './FieldSubjectCategory'

type TInformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps
  codelistUtils: ICodelistProps
}
type TDocumentInfoTypeUseWithId = IDocumentInfoTypeUse & { id: string }

const InformationTypesTable = (props: TInformationTypesTableProps) => {
  const [tableContent, setTableContent] = useState<TDocumentInfoTypeUseWithId[]>([])
  const { arrayHelpers, codelistUtils } = props

  const newRow = () => ({
    id: shortid.generate(),
    informationTypeId: '',
    informationType: undefined,
    subjectCategories: [],
  })

  const showDeleteRowButton: boolean = arrayHelpers.form.values.informationTypes.length > 1

  useEffect(() => {
    if (arrayHelpers.form.values.informationTypes.length < 1) arrayHelpers.push(newRow())
    setTableContent(arrayHelpers.form.values.informationTypes)
  }, [arrayHelpers])

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ maxWidth: '45%' }}>Opplysningstype</Table.HeaderCell>
          <Table.HeaderCell style={{ maxWidth: '45%' }}>Personkategori</Table.HeaderCell>
          <Table.HeaderCell style={{ maxWidth: '10%', textAlign: 'center' }}>
            <Button
              type="button"
              kind="secondary"
              size="xsmall"
              icon={
                <span className="flex items-center leading-none">
                  <PlusIcon aria-hidden className="block" />
                </span>
              }
              onClick={() => arrayHelpers.push(newRow())}
            >
              Legg til ny
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tableContent.map((row: TDocumentInfoTypeUseWithId, index: number) => (
          <Fragment key={row.id}>
            <Table.Row>
              <Table.DataCell style={{ maxWidth: '45%' }}>
                <FieldInformationType
                  documentInformationType={row}
                  handleChange={(values: IDocumentInfoTypeUse) =>
                    arrayHelpers.replace(index, values)
                  }
                />
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '45%' }}>
                <FieldSubjectCategory
                  codelistUtils={codelistUtils}
                  documentInformationType={row}
                  handleChange={(values: IDocumentInformationTypes) =>
                    arrayHelpers.replace(index, values)
                  }
                />
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '10%', textAlign: 'center' }}>
                {showDeleteRowButton && (
                  <Button
                    kind="secondary"
                    size="xsmall"
                    icon={
                      <span className="flex items-center leading-none">
                        <TrashIcon aria-hidden className="block" />
                      </span>
                    }
                    onClick={() => {
                      arrayHelpers.remove(index)
                    }}
                  >
                    Slett
                  </Button>
                )}
              </Table.DataCell>
            </Table.Row>
            <Table.Row>
              <Table.DataCell style={{ maxWidth: '45%' }}>
                <Error
                  fieldName={`informationTypes[${index}].informationTypeId`}
                  fullWidth={true}
                />
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '45%' }}>
                <Error
                  fieldName={`informationTypes[${index}].subjectCategories`}
                  fullWidth={true}
                />
              </Table.DataCell>
              <Table.DataCell style={{ maxWidth: '10%' }} />
            </Table.Row>
          </Fragment>
        ))}
      </Table.Body>
    </Table>
  )
}

export default InformationTypesTable
