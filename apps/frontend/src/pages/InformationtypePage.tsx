import * as React from 'react'
import {useEffect} from 'react'
import {Block} from 'baseui/block'
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {RouteComponentProps} from 'react-router-dom'
import {H4} from 'baseui/typography'
import {StyledSpinnerNext} from 'baseui/spinner'

import InformationtypeMetadata from '../components/InformationType/InformationtypeMetadata/'
import {intl, useAwait} from '../util'
import {CodeUsage, Disclosure, Document, InformationType, Policy} from '../constants'
import {codelist, ListName} from '../service/Codelist'
import {user} from '../service/User'
import {getCodelistUsageByListName, getDisclosuresByInformationTypeId, getDocumentsForInformationType, getInformationType, getPoliciesForInformationType,} from '../api'
import InformationTypeAccordion from '../components/InformationType/ListCategoryInformationtype'
import Button from '../components/common/Button'

export type PurposeMap = { [purpose: string]: Policy[] }

const InformationtypePage = (props: RouteComponentProps<{ id?: string, purpose?: string }>) => {
  const [isLoading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
  const [informationtype, setInformationtype] = React.useState<InformationType>()
  const [policies, setPolicies] = React.useState<Policy[]>([])
  const [disclosures, setDisclosures] = React.useState<Disclosure[]>([])
  const [documents, setDocuments] = React.useState<Document[]>([])
  const [categoryUsages, setCategoryUsages] = React.useState<CodeUsage[]>()

  useAwait(user.wait())
  useAwait(codelist.wait())

  React.useEffect(() => {
    (async () => {
      setLoading(true)
      let response = await getCodelistUsageByListName(ListName.CATEGORY)
      setCategoryUsages(response.codesInUse)
      setLoading(false)
    })()
  }, [])

  useEffect(() => setInformationTypeId(props.match.params.id), [props.match.params.id])

  useEffect(() => {
    (async () => {
      if (!informationTypeId) {
        return
      }
      setLoading(true)
      try {
        const infoTypeRes = await getInformationType(informationTypeId)
        const policiesRes = await getPoliciesForInformationType(informationTypeId)
        const disclosuresRes = await getDisclosuresByInformationTypeId(informationTypeId)
        const docsRes = await getDocumentsForInformationType(informationTypeId)
        setInformationtype(infoTypeRes)
        setPolicies(policiesRes.content)
        setDisclosures(disclosuresRes)
        setDocuments(docsRes.content)
      } catch (err) {
        setError(err.message)
      }

      if (!props.match.params.id) props.history.push(`/informationtype/${informationTypeId}`)
      setLoading(false)
    })()
  }, [informationTypeId])

  if (isLoading) {
    return <StyledSpinnerNext size={30}/>
  }

  if (informationTypeId) {
    return <>
      {!error && informationtype && (
        <InformationtypeMetadata
          informationtype={informationtype}
          policies={policies}
          disclosures={disclosures}
          documents={documents}
          expanded={props.match.params.purpose ? [props.match.params.purpose] : []}
          onSelectPurpose={purpose => props.history.push(`/informationtype/${informationTypeId}/${purpose}`)}
        />
      )}

      {error && (<p>{error}</p>)}
    </>
  }

  return (
    <>
      <Block display="flex" justifyContent="space-between">
        <H4 marginTop='0'>{intl.informationTypes}</H4>
        <Block>
          {user.canWrite() &&
          <Button kind="outline" onClick={() => props.history.push('/informationtype/create')}>
            <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createNew}
          </Button>
          }
        </Block>
      </Block>
      <InformationTypeAccordion categoryUsages={categoryUsages}/>
    </>
  )
}

export default InformationtypePage
