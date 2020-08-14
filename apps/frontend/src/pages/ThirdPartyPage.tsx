import * as React from 'react'
import {useEffect} from 'react'
import {intl} from '../util'
import {useParams} from 'react-router-dom'
import {codelist, ListName} from '../service/Codelist'
import {Plus} from 'baseui/icon'
import {Block, BlockProps} from 'baseui/block'
import {createDisclosure, deleteDisclosure, getDisclosuresByRecipient, getInformationTypesBy, updateDisclosure} from '../api'
import TableDisclosure from '../components/common/TableDisclosure'
import {H5, Label2, Paragraph2} from 'baseui/typography'
import {Button, KIND} from 'baseui/button'
import {user} from '../service/User'
import {Disclosure, DisclosureFormValues, InformationType} from '../constants'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import {StyledSpinnerNext} from 'baseui/spinner'
import ThirdPartiesTable from '../components/common/ThirdPartiesTable'

const labelBlockProps: BlockProps = {
  marginBottom: '1rem',
  font: 'font400'
}

export type PathParams = {thirdPartyCode: string}

const ThirdPartyPage = () => {
  const params = useParams<PathParams>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>([])
  const [informationTypeList, setInformationTypeList] = React.useState<InformationType[]>()
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureList || disclosureList.length < 1)
        setDisclosureList([createdDisclosure])
      else if (disclosureList && createdDisclosure)
        setDisclosureList([...disclosureList, createdDisclosure])

      setShowCreateModal(false)
    } catch (err) {
      setShowCreateModal(true)
      setError(err.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let updatedDisclosure = await updateDisclosure(disclosure)
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== updatedDisclosure.id), updatedDisclosure])
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }


  const handleDeleteDisclosure = async (disclosure: Disclosure) => {
    if (!disclosure) return false
    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: params.thirdPartyCode,
    recipientPurpose: '',
    description: '',
    document: undefined,
    legalBases: [],
    legalBasesOpen: false,
    start: undefined,
    end: undefined
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await codelist.wait()
      if (params.thirdPartyCode) {
        setDisclosureList(await getDisclosuresByRecipient(params.thirdPartyCode))
        setInformationTypeList((await getInformationTypesBy({source: params.thirdPartyCode})).content)
      }
      setIsLoading(false)
    })()
  }, [params.thirdPartyCode])


  return (
    <>
      {isLoading && <StyledSpinnerNext/>}

      {!isLoading && codelist && (
        <>
          <Block marginBottom="3rem">
            <H5>{codelist.getShortname(ListName.THIRD_PARTY, params.thirdPartyCode)}</H5>
            <Paragraph2>{codelist.getDescription(ListName.THIRD_PARTY, params.thirdPartyCode)}</Paragraph2>
          </Block>

          <Block display="flex" justifyContent="space-between">
            <Label2 {...labelBlockProps}>{intl.disclosuresToThirdParty}</Label2>
            {user.canWrite() &&
            <Block>
              <Button
                size="compact"
                kind={KIND.minimal}
                onClick={() => setShowCreateModal(true)}
                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22}/></Block>}
              >
                {intl.createNew}
              </Button>
              <ModalThirdParty
                title={intl.createThirdPartyModalTitle}
                isOpen={showCreateModal}
                initialValues={initialFormValues}
                submit={handleCreateDisclosure}
                onClose={() => {
                  setShowCreateModal(false)
                  setError(undefined)
                }}
                errorOnCreate={error}
                disableRecipientField={true}
              />
            </Block>
            }
          </Block>
          <Block marginBottom="3rem">
            <TableDisclosure
              list={disclosureList}
              showRecipient={false}
              errorModal={error}
              editable
              submitDeleteDisclosure={handleDeleteDisclosure}
              submitEditDisclosure={handleEditDisclosure}
              onCloseModal={() => setError(undefined)}
            />
          </Block>
          <Block>
            <ThirdPartiesTable informationTypes={informationTypeList || []} sortName={true}/>
          </Block>
        </>
      )}
    </>
  )
}

export default ThirdPartyPage
