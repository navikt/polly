import React from 'react'
import { StyledCell, StyledHead, StyledHeadCell, StyledRow } from 'baseui/table'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import { DocumentInformationTypes, DocumentInfoTypeUse } from '../../../constants'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FieldArrayRenderProps } from 'formik'
import FieldInformationType from './FieldInformationType'
import FieldSubjectCategory from './FieldSubjectCategory'
import { Error } from '../../common/ModalSchema'
import shortid from 'shortid'
import Button from '../../common/Button'

type InformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps
}
type DocumentInfoTypeUseWithId = DocumentInfoTypeUse & { id: string }

const InformationTypesTable = (props: InformationTypesTableProps) => {
  const [tableContent, setTableContent] = React.useState<DocumentInfoTypeUseWithId[]>([])
  const { arrayHelpers } = props

  const newRow = () => ({
    id: shortid.generate(),
    informationTypeId: '',
    informationType: undefined,
    subjectCategories: [],
  })

  const showDeleteRowButton = arrayHelpers.form.values.informationTypes.length > 1

  React.useEffect(() => {
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
        <React.Fragment key={row.id}>
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
        </React.Fragment>
      ))}
    </>
  )
}

export default InformationTypesTable
