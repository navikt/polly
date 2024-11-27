import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { KIND } from 'baseui/button'
import { StyledCell, StyledHead, StyledHeadCell, StyledRow } from 'baseui/table'
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
    <>
      <StyledHead>
        <StyledHeadCell style={{ maxWidth: '45%' }}>Opplysningstype</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: '45%' }}>Personkategori</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: '10%', justifyContent: 'center' }}>
          <Button
            type="button"
            kind={KIND.secondary}
            size="xsmall"
            icon={faPlus}
            onClick={() => arrayHelpers.push(newRow())}
          >
            Legg til ny
          </Button>
        </StyledHeadCell>
      </StyledHead>

      {tableContent.map((row: TDocumentInfoTypeUseWithId, index: number) => (
        <Fragment key={row.id}>
          <StyledRow>
            <StyledCell style={{ maxWidth: '45%' }}>
              <FieldInformationType
                documentInformationType={row}
                handleChange={(values: IDocumentInfoTypeUse) => arrayHelpers.replace(index, values)}
              />
            </StyledCell>
            <StyledCell style={{ maxWidth: '45%' }}>
              <FieldSubjectCategory
                codelistUtils={codelistUtils}
                documentInformationType={row}
                handleChange={(values: IDocumentInformationTypes) =>
                  arrayHelpers.replace(index, values)
                }
              />
            </StyledCell>
            <StyledCell style={{ maxWidth: '10%', justifyContent: 'center' }}>
              {showDeleteRowButton && (
                <Button
                  kind={KIND.secondary}
                  size="xsmall"
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
