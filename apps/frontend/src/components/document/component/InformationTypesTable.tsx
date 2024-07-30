import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { SIZE as ButtonSize, KIND } from 'baseui/button'
import { StyledCell, StyledHead, StyledHeadCell, StyledRow } from 'baseui/table'
import { FieldArrayRenderProps } from 'formik'
import { Fragment, useEffect, useState } from 'react'
import shortid from 'shortid'
import { DocumentInfoTypeUse, DocumentInformationTypes } from '../../../constants'
import Button from '../../common/Button'
import { Error } from '../../common/ModalSchema'
import FieldInformationType from './FieldInformationType'
import FieldSubjectCategory from './FieldSubjectCategory'

type InformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps
}
type DocumentInfoTypeUseWithId = DocumentInfoTypeUse & { id: string }

const InformationTypesTable = (props: InformationTypesTableProps) => {
  const [tableContent, setTableContent] = useState<DocumentInfoTypeUseWithId[]>([])
  const { arrayHelpers } = props

  const newRow = () => ({
    id: shortid.generate(),
    informationTypeId: '',
    informationType: undefined,
    subjectCategories: [],
  })

  const showDeleteRowButton = arrayHelpers.form.values.informationTypes.length > 1

  useEffect(() => {
    if (arrayHelpers.form.values.informationTypes.length < 1) arrayHelpers.push(newRow())
    setTableContent(arrayHelpers.form.values.informationTypes)
  }, [arrayHelpers])

  return (
    <>
      <StyledHead>
        <StyledHeadCell style={{ maxWidth: '45%' }}>Opplysningstype</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: '45%' }}>Personkategori</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: '10%', justifyContent: 'center' }}>
          <Button type="button" kind={KIND.secondary} size={ButtonSize.compact} icon={faPlus} onClick={() => arrayHelpers.push(newRow())}>
            Legg til ny
          </Button>
        </StyledHeadCell>
      </StyledHead>

      {tableContent.map((row: DocumentInfoTypeUseWithId, index: number) => (
        <Fragment key={row.id}>
          <StyledRow>
            <StyledCell style={{ maxWidth: '45%' }}>
              <FieldInformationType documentInformationType={row} handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)} />
            </StyledCell>
            <StyledCell style={{ maxWidth: '45%' }}>
              <FieldSubjectCategory documentInformationType={row} handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)} />
            </StyledCell>
            <StyledCell style={{ maxWidth: '10%', justifyContent: 'center' }}>
              {showDeleteRowButton && (
                <Button
                  kind={KIND.secondary}
                  size={ButtonSize.compact}
                  icon={faTrash}
                  onClick={() => {
                    arrayHelpers.remove(index)
                  }}
                >
                  Slett
                </Button>
              )}
            </StyledCell>
          </StyledRow>
          <StyledRow>
            <StyledCell style={{ maxWidth: '45%' }}>
              <Error fieldName={`informationTypes[${index}].informationTypeId`} fullWidth={true} />
            </StyledCell>
            <StyledCell style={{ maxWidth: '45%' }}>
              <Error fieldName={`informationTypes[${index}].subjectCategories`} fullWidth={true} />
            </StyledCell>
            <StyledCell style={{ maxWidth: '10%', justifyContent: 'center' }} />
          </StyledRow>
        </Fragment>
      ))}
    </>
  )
}

export default InformationTypesTable
