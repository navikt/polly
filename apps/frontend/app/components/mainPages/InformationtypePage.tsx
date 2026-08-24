'use client'

import { getCodelistUsageByListName } from '@/api/CodelistApi'
import { getDisclosuresByInformationTypeId } from '@/api/DisclosureApi'
import { getDocumentsForInformationType } from '@/api/DocumentApi'
import { getInformationType } from '@/api/InfoTypeApi'
import { getPoliciesForInformationType } from '@/api/PolicyApi'
import {
  ICategoryUsage,
  ICodeUsage,
  IDisclosure,
  IDocument,
  IInformationType,
  IPolicy,
} from '@/constants'
import { EListName } from '@/service/Codelist'
import { user } from '@/service/User'
import { TNavigateFunction, useNavigate, useParams } from '@/util/router'
import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Heading, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { InformationtypeMetadata } from '../InformationType/InformationtypeMetadata/InformationtypeMetadata'
import ListCategoryInformationtype from '../InformationType/ListCategoryInformationtype'
import Button from '../common/Button/CustomButton'

export type TPurposeMap = { [purpose: string]: IPolicy[] }

const InformationtypePage = () => {
  const params = useParams<{ id?: string }>()
  const navigate: TNavigateFunction = useNavigate()

  const [error, setError] = useState(null)
  const [informationTypeId, setInformationTypeId] = useState(params.id)
  const [informationtype, setInformationtype] = useState<IInformationType>()
  const [policies, setPolicies] = useState<IPolicy[]>()
  const [disclosures, setDisclosures] = useState<IDisclosure[]>()
  const [documents, setDocuments] = useState<IDocument[]>()
  const [categoryUsages, setCategoryUsages] = useState<ICodeUsage[]>()

  useEffect(() => {
    ;(async () => {
      const response: ICategoryUsage = await getCodelistUsageByListName(EListName.CATEGORY)
      setCategoryUsages(response.codesInUse)
    })()
  }, [])

  if (params.id !== informationTypeId) setInformationTypeId(params.id)

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
        {!informationtype && (
          <div className='flex w-full justify-center'>
            <Loader size='3xlarge' />
          </div>
        )}
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
      <div className='flex justify-between'>
        <Heading level='1' size='medium' className='m-0'>
          Opplysningstyper
        </Heading>
        <div>
          {user.canWrite() && (
            <Button
              kind='outline'
              startEnhancer={
                <span className='flex items-center leading-none'>
                  <PlusCircleIcon aria-hidden className='block' />
                </span>
              }
              onClick={() => navigate('/informationtype/create')}
            >
              Opprett ny opplysningstype
            </Button>
          )}
        </div>
      </div>
      {!categoryUsages && (
        <div className='flex w-full justify-center'>
          <Loader size='3xlarge' />
        </div>
      )}
      {categoryUsages && <ListCategoryInformationtype categoryUsages={categoryUsages} />}
    </>
  )
}

export default InformationtypePage
