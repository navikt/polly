import * as React from 'react'
import { useEffect } from 'react'
import { Block } from 'baseui/block'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'
import { HeadingMedium } from 'baseui/typography'

import { InformationtypeMetadata } from '../components/InformationType/InformationtypeMetadata/'
import { intl, theme } from '../util'
import { CodeUsage, Disclosure, Document, InformationType, Policy } from '../constants'
import { ListName } from '../service/Codelist'
import { user } from '../service/User'
import { getCodelistUsageByListName, getDisclosuresByInformationTypeId, getDocumentsForInformationType, getInformationType, getPoliciesForInformationType } from '../api'
import ListCategoryInformationtype from '../components/InformationType/ListCategoryInformationtype'
import Button from '../components/common/Button'
import { Spinner } from '../components/common/Spinner'
import {ampli} from "../service/Amplitude";

export type PurposeMap = { [purpose: string]: Policy[] }

const InformationtypePage = () => {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [error, setError] = React.useState(null)
  const [informationTypeId, setInformationTypeId] = React.useState(params.id)
  const [informationtype, setInformationtype] = React.useState<InformationType>()
  const [policies, setPolicies] = React.useState<Policy[]>()
  const [disclosures, setDisclosures] = React.useState<Disclosure[]>()
  const [documents, setDocuments] = React.useState<Document[]>()
  const [categoryUsages, setCategoryUsages] = React.useState<CodeUsage[]>()

  ampli.logEvent("besøk", {side: 'Opplysningstyper', url: '/informationtype/', app: 'Behandlingskatalogen'})

  useEffect(() => {
    ;(async () => {
      let response = await getCodelistUsageByListName(ListName.CATEGORY)
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
      } catch (err: any) {
        setError(err.message)
      }

      if (!params.id) navigate(`/informationtype/${informationTypeId}`)
    })()
  }, [informationTypeId])

  if (informationTypeId) {
    return (
      <>
        {!informationtype && <Spinner size={theme.sizing.scale1200} />}
        {!error && informationtype && <InformationtypeMetadata informationtype={informationtype} policies={policies} disclosures={disclosures} documents={documents} />}

        {error && <p>{error}</p>}
      </>
    )
  }

  return (
    <>
      <Block display="flex" justifyContent="space-between">
        <HeadingMedium marginTop="0">{intl.informationTypes}</HeadingMedium>
        <Block>
          {user.canWrite() && (
            <Button kind="outline" onClick={() => navigate('/informationtype/create')}>
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;{intl.createNew}
            </Button>
          )}
        </Block>
      </Block>
      {!categoryUsages && <Spinner size={theme.sizing.scale1200} />}
      {categoryUsages && <ListCategoryInformationtype categoryUsages={categoryUsages} />}
    </>
  )
}

export default InformationtypePage
