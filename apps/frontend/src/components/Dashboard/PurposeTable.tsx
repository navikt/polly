import { HeadingLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getProcessByStateAndStatus,
  getProcessByStateAndStatusForDepartment,
  getProcessByStateAndStatusForProductArea,
} from '../../api/GetAllApi'
import { EProcessField, EProcessState, EProcessStatusFilter, IProcessShort } from '../../constants'
import { useQueryParam } from '../../util/hooks'
import { SimpleProcessTable } from '../Process/SimpleProcessTable'
import { Spinner } from '../common/Spinner'

type TPathProps = {
  filterName: EProcessField
  filterValue: EProcessState
  filterStatus: EProcessStatusFilter
}

const PurposeTable = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [filtered, setFiltered] = useState<IProcessShort[]>([])
  const [title, setTitle] = useState('')
  const { filterName, filterValue, filterStatus } = useParams<TPathProps>()
  const department: string | undefined = useQueryParam('department')
  const productareaId: string | undefined = useQueryParam('productarea')

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      changeTitle()
      if (filterName && filterValue) {
        if (department) {
          let response: IProcessShort[] = await getProcessByStateAndStatusForDepartment(
            filterName,
            filterValue,
            filterStatus,
            department
          )
          setFiltered(response)
        } else if (productareaId) {
          let response: IProcessShort[] = await getProcessByStateAndStatusForProductArea(
            filterName,
            filterValue,
            filterStatus,
            productareaId
          )
          setFiltered(response)
        } else {
          let response: IProcessShort[] = await getProcessByStateAndStatus(
            filterName,
            filterValue,
            filterStatus
          )
          setFiltered(response)
        }
      }
      setLoading(false)
    })()
  }, [filterName, filterValue, filterStatus, department])

  const changeTitle = () => {
    if (filterName === EProcessField.DPIA && filterValue) {
      setTitle(`Behov for PVK: ${translateToNorwegian(filterValue)}`)
    } else if (filterName === EProcessField.MISSING_LEGAL_BASIS) {
      setTitle('Behandlinger med rettslig grunnlag uavklart')
    } else if (filterName === EProcessField.MISSING_ARTICLE_6) {
      setTitle('Behandlinger med rettslig grunnlag artikkel 6 mangler')
    } else if (filterName === EProcessField.MISSING_ARTICLE_9) {
      setTitle('Behandlinger med rettslig grunnlag artikkel 9 mangler')
    } else if (filterName === EProcessField.RETENTION_DATA) {
      setTitle('Uavklart lagringsbehov')
    } else if (filterName === EProcessField.RETENTION) {
      switch (filterValue) {
        case EProcessState.YES:
          return setTitle('Omfattes av NAVs bevarings- og kassasjonsvedtak')
        case EProcessState.NO:
          return setTitle('Omfattes ikke av NAVs bevarings- og kassasjonsvedtak')
        case EProcessState.UNKNOWN:
          return setTitle('Uavklart om omfattes av NAVs bevarings- og kassasjonsvedtak')
      }
    } else if (filterName === EProcessField.PROFILING && filterValue) {
      setTitle(`Profilering: ${translateToNorwegian(filterValue)} `)
    } else if (filterName === EProcessField.AUTOMATION && filterValue) {
      setTitle(`Helautomatisk behandling: ${translateToNorwegian(filterValue)} `)
    } else if (filterName === EProcessField.DATA_PROCESSOR && filterValue) {
      setTitle(`Databehandler: ${translateToNorwegian(filterValue)} `)
    } else if (filterName === EProcessField.COMMON_EXTERNAL_PROCESSOR) {
      setTitle('Behandlinger hvor NAV er felles behandlingsansvarlig med ekstern part')
    } else if (filterName === EProcessField.DPIA_REFERENCE_MISSING) {
      setTitle('Ref. til PVK ikke angitt')
    }
  }

  return (
    <>
      <HeadingLarge>{title}</HeadingLarge>
      {loading && <Spinner size="80px" />}
      {!loading && (
        <SimpleProcessTable
          processes={filtered}
          title={title}
          showCommonExternalProcessResponsible={
            filterName === EProcessField.COMMON_EXTERNAL_PROCESSOR
          }
        />
      )}
    </>
  )
}

const translateToNorwegian = (filtervalue: string) => {
  switch (filtervalue) {
    case 'YES':
      return 'Ja'
    case 'NO':
      return 'Nei'
    case 'UNKNOWN':
      return 'Uavklart'
    default:
      return ''
  }
}

export default PurposeTable
