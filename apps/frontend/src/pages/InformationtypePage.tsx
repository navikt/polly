import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HeadingMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import {
  getCodelistUsageByListName,
  getDisclosuresByInformationTypeId,
  getDocumentsForInformationType,
  getInformationType,
  getPoliciesForInformationType,
} from '../api'
import { InformationtypeMetadata } from '../components/InformationType/InformationtypeMetadata/InformationtypeMetadata'
import ListCategoryInformationtype from '../components/InformationType/ListCategoryInformationtype'
import Button from '../components/common/Button'
import { Spinner } from '../components/common/Spinner'
import {
  ICategoryUsage,
  ICodeUsage,
  IDisclosure,
  IDocument,
  IInformationType,
  IPolicy,
} from '../constants'
import { ampli } from '../service/Amplitude'
import { EListName } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'

export type TPurposeMap = { [purpose: string]: IPolicy[] }

const InformationtypePage = () => {
  const params = useParams<{ id?: string }>()
  const navigate: NavigateFunction = useNavigate()

  const [error, setError] = useState(null)
  const [informationTypeId, setInformationTypeId] = useState(params.id)
  const [informationtype, setInformationtype] = useState<IInformationType>()
  const [policies, setPolicies] = useState<IPolicy[]>()
  const [disclosures, setDisclosures] = useState<IDisclosure[]>()
  const [documents, setDocuments] = useState<IDocument[]>()
  const [categoryUsages, setCategoryUsages] = useState<ICodeUsage[]>()

  ampli.logEvent('besøk', {
    side: 'Opplysningstyper',
    url: '/informationtype/',
    app: 'Behandlingskatalogen',
  })

  useEffect(() => {
    ;(async () => {
      const response: ICategoryUsage = await getCodelistUsageByListName(EListName.CATEGORY)
      setCategoryUsages(response.codesInUse)
    })()
  }, [])

  useEffect(() => setInformationTypeId(params.id), [params.id])

  useEffect(() => {
    ;(async () => {
      if (!informationTypeId) {
        return
      }
      try {
        setInformationtype(await getInformationType(informationTypeId))
        setPolicies((await getPoliciesForInformationType(informationTypeId)).content)
        setDisclosures(await getDisclosuresByInformationTypeId(informationTypeId))
        setDocuments((await getDocumentsForInformationType(informationTypeId)).content)
      } catch (error: any) {
        setError(error.message)
      }

      if (!params.id) navigate(`/informationtype/${informationTypeId}`)
    })()
  }, [informationTypeId])

  if (informationTypeId) {
    return (
      <>
        {!informationtype && <Spinner size={theme.sizing.scale1200} />}
        {!error && informationtype && (
          <InformationtypeMetadata
            informationtype={informationtype}
            policies={policies}
            disclosures={disclosures}
            documents={documents}
          />
        )}

        {error && <p>{error}</p>}
      </>
    )
  }

  return (
    <>
      <div className="flex justify-between">
        <HeadingMedium marginTop="0">Opplysningstyper</HeadingMedium>
        <div>
          {user.canWrite() && (
            <Button kind="outline" onClick={() => navigate('/informationtype/create')}>
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;Opprett ny opplysningstype
            </Button>
          )}
        </div>
      </div>
      {!categoryUsages && <Spinner size={theme.sizing.scale1200} />}
      {categoryUsages && <ListCategoryInformationtype categoryUsages={categoryUsages} />}
    </>
  )
}

export default InformationtypePage
