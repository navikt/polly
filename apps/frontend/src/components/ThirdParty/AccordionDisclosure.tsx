import * as React from 'react'
import { useEffect, useState } from 'react'
import { Disclosure, DisclosureAbroad, DisclosureAlert, DisclosureFormValues, ObjectType } from '../../constants'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { theme } from '../../util'
import { Block } from 'baseui/block'
import { Panel, StatelessAccordion } from 'baseui/accordion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faEdit, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { convertDisclosureToFormValues, getDisclosure } from '../../api'
import { Spinner } from 'baseui/spinner'
import DataText from '../common/DataText'
import { canViewAlerts } from '../../pages/AlertEventPage'
import Button from '../common/Button'
import { useNavigate } from 'react-router-dom'
import { SIZE as ButtonSize } from 'baseui/button'
import ModalThirdParty from './ModalThirdPartyForm'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium, ParagraphSmall } from 'baseui/typography'
import { StyledLink } from 'baseui/link'
import LinkListProcess from './components/LinkListProcess'
import { codelist, ListName } from '../../service/Codelist'
import { LegalBasisView } from '../common/LegalBasis'
import { shortenLinksInText } from '../../util/helper-functions'
import { user } from '../../service/User'
import LinkListInformationType from './components/LinkListInformationType'
import { lastModifiedDate } from '../../util/date-formatter'
import { DotTags } from '../common/DotTag'
import { TeamList } from '../common/Team'


type AccordionDisclosureProps = {
  disclosureList: Array<Disclosure>
  showRecipient: boolean
  editable: boolean
  submitDeleteDisclosure?: (disclosure: Disclosure) => Promise<boolean>
  submitEditDisclosure?: (disclosure: DisclosureFormValues) => Promise<boolean>
  errorModal?: string
  onCloseModal?: () => void
  expand?: string
}

type Alerts = { [k: string]: DisclosureAlert }

const showAbroad = (abroad: DisclosureAbroad) => {
  if (abroad.abroad === true) {
    if (abroad.refToAgreement) {
      return (
        <>
          <DataText label='Utleveres personopplysningene til utlandet?'>
            <Block>
              {'Ja. Referanse'}
              {shortenLinksInText(abroad.refToAgreement)}
            </Block>
          </DataText>
          {abroad.businessArea && <DataText label='Trygdeområde' text={abroad.businessArea} />}
        </>
      )
    } else {
      return (
        <>
          <DataText label='Utleveres personopplysningene til utlandet?' children='Ja' />
          {abroad.businessArea && <DataText label='Trygdeområde' text={abroad.businessArea} />}
        </>
      )
    }
  } else if (abroad.abroad === false) {
    return <DataText label='Utleveres personopplysningene til utlandet?' text='Nei' />
  } else {
    return <DataText label='Utleveres personopplysningene til utlandet?' text='Uavklart' />
  }
}

const AccordionDisclosure = (props: AccordionDisclosureProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false)
  const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [hasAlert, setHasAlert] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<React.Key[]>(props.expand ? [props.expand] : [])

  const { disclosureList, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal } = props

  useEffect(() => {
    props.expand && renewDisclosureDetails(props.expand)
  }, [props.expand])

  const renewDisclosureDetails = async (disclosureId: string) => {
    setLoading(true)
    const disc = await getDisclosure(disclosureId)
    setSelectedDisclosure(disc)
    const alert = await getAlertForDisclosure(disclosureId)
    setHasAlert(alert.missingArt6)
    setLoading(false)
  }

  return (
    <React.Fragment>
      <StatelessAccordion
        onChange={(e) => {
          if (e.expanded.length > 0) {
            renewDisclosureDetails(e.expanded[0].toString())
          }
          setExpanded(e.expanded)
        }}
        expanded={expanded}
      >
        {disclosureList &&
          disclosureList
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((d: Disclosure) => {
              return (
                <Panel
                  title={
                    <Block display={'flex'} width={'100%'}>
                      <Block>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </Block>
                      <Block marginLeft={'5px'}>{d.name}</Block>
                      <Block marginLeft={'auto'}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <>
                            {d.id === expanded[0]
                              ? editable && (
                                  <>
                                    {selectedDisclosure && hasAlert && canViewAlerts() && (
                                      <Button
                                        kind={'outline'}
                                        size={ButtonSize.compact}
                                        icon={faExclamationCircle}
                                        marginRight
                                        tooltip={hasAlert ? 'Varsler: Behandlingsgrunnlag for artikkel 6 mangler' : 'Varsler: Nei'}
                                        onClick={() => navigate(`/alert/events/disclosure/${selectedDisclosure.id}`)}
                                      >
                                        Varsler
                                      </Button>
                                    )}
                                    {user.isLoggedIn() && (
                                      <>
                                        <Button kind={'outline'} size={ButtonSize.compact} icon={faEdit} onClick={() => setShowEditModal(true)} marginRight>
                                          Redigér
                                        </Button>

                                        <Button kind={'outline'} size={ButtonSize.compact} icon={faTrash} onClick={() => setShowDeleteModal(true)}>
                                          Slett
                                        </Button>
                                      </>
                                    )}
                                  </>
                                )
                              : ''}
                          </>
                        </div>
                      </Block>
                    </Block>
                  }
                  key={d.id}
                  overrides={{
                    ToggleIcon: {
                      component: () => null,
                    },
                    Content: {
                      style: {
                        backgroundColor: theme.colors.white,
                        // Outline width
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                      },
                    },
                  }}
                >
                  {isLoading ? (
                    <Block padding={theme.sizing.scale400}>
                      <Spinner $size={theme.sizing.scale1200} />
                    </Block>
                  ) : (
                    <Block
                      $style={{
                        outline: `4px ${theme.colors.primary200} solid`,
                      }}
                    >
                      <Block padding={theme.sizing.scale800}>
                        <Block width="100%">
                          {showRecipient &&
                          <DataText label='Mottaker' text={selectedDisclosure?.recipient.shortName} />
                          }
                          <DataText label='Navn på utlevering' text={selectedDisclosure?.name} />
                          <DataText label='Formål med utlevering' text={selectedDisclosure?.recipientPurpose} />
                          <DataText label='Ytterligere beskrivelse' text={selectedDisclosure?.description} />

                          <DataText label='Relaterte behandlinger'>
                            {LinkListProcess(selectedDisclosure?.processes ? selectedDisclosure?.processes : [], '/process/purpose', ObjectType.PROCESS)}
                          </DataText>

                          <DataText label='Opplysningstyper'>
                            {LinkListInformationType(
                              selectedDisclosure?.informationTypes ? selectedDisclosure?.informationTypes.map((p) => p) : [],
                              '/informationtype',
                              ObjectType.INFORMATION_TYPE,
                            )}
                          </DataText>

                          <DataText
                            label='Dokument'
                            children={
                              selectedDisclosure?.documentId ? (
                                <StyledLink href={`/document/${selectedDisclosure?.documentId}`} target="_blank" rel="noopener noreferrer">
                                  {selectedDisclosure?.document?.name}
                                </StyledLink>
                              ) : (
                                <>Ikke angitt</>
                              )
                            }
                          />

                          {selectedDisclosure?.legalBases.length ? (
                            <DataText label='Behandlingsgrunnlag for hele behandlingen' text={''}>
                              {selectedDisclosure.legalBases
                                .sort((a, b) => codelist.getShortname(ListName.GDPR_ARTICLE, a.gdpr.code).localeCompare(codelist.getShortname(ListName.GDPR_ARTICLE, b.gdpr.code)))
                                .map((legalBasis, index) => (
                                  <Block key={index}>
                                    <LegalBasisView legalBasis={legalBasis} />
                                  </Block>
                                ))}
                            </DataText>
                          ) : (
                            <>
                              <DataText label='Behandlingsgrunnlag for hele behandlingen' text='Ikke angitt' />
                            </>
                          )}
                        </Block>
                        {selectedDisclosure && showAbroad(selectedDisclosure?.abroad)}

                        <Block>
                          <DataText
                            label='Hjemmel for unntak fra taushetsplikt er vurdert'
                            text={d.assessedConfidentiality !== null ? (d.assessedConfidentiality ? 'Ja' : 'Nei') : 'Ikke angitt'}
                          />

                          {d.assessedConfidentiality !== null && (
                            <DataText label={d.assessedConfidentiality ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                              : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'} text="">
                              {shortenLinksInText(d.confidentialityDescription ? d.confidentialityDescription : 'Ikke angitt')}
                            </DataText>
                          )}
                        </Block>

                        <Block>
                          <DataText label='Avdeling'>
                            {d.department?.code && <DotTags list={ListName.DEPARTMENT} codes={[d.department]} commaSeparator linkCodelist />}
                            {!d.department?.code && 'Ikke angitt'}
                          </DataText>

                          <DataText label='Team'>
                          {!!d.productTeams?.length ? <TeamList teamIds={d.productTeams} /> : 'Ikke angitt'}
                          </DataText>
                        </Block>
                      </Block>
                      <Block display="flex" justifyContent="flex-end" marginBottom={theme.sizing.scale600} marginRight={theme.sizing.scale600}>
                        <ParagraphSmall>
                          {selectedDisclosure && (
                            <i>
                              {`Sist endret av ${selectedDisclosure?.changeStamp?.lastModifiedBy} ,
                              ${lastModifiedDate(selectedDisclosure?.changeStamp?.lastModifiedDate)}`}
                            </i>
                          )}
                        </ParagraphSmall>
                      </Block>
                    </Block>
                  )}
                </Panel>
              )
            })}
      </StatelessAccordion>
      {editable && showEditModal && selectedDisclosure && (
        <ModalThirdParty
          title='Rediger utlevering'
          isOpen={showEditModal}
          initialValues={convertDisclosureToFormValues(selectedDisclosure)}
          submit={async (values) => {
            if (submitEditDisclosure && (await submitEditDisclosure(values))) {
              renewDisclosureDetails(selectedDisclosure?.id)
              setShowEditModal(false)
            } else {
              setShowEditModal(true)
            }
          }}
          onClose={() => {
            onCloseModal && onCloseModal()
            setShowEditModal(false)
          }}
          errorOnCreate={errorModal}
          disableRecipientField={true}
        />
      )}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} isOpen={showDeleteModal} animate size="default">
          <ModalHeader>Bekreft sletting</ModalHeader>
          <ModalBody>
            <ParagraphMedium>
              Bekreft sletting av utlevering {selectedDisclosure?.name}
            </ParagraphMedium>
          </ModalBody>

          <ModalFooter>
            <Block display="flex" justifyContent="flex-end">
              <Block alignSelf="flex-end">{errorModal && <p>{errorModal}</p>}</Block>
              <Button
                kind="secondary"
                onClick={() => {
                  setShowDeleteModal(false)
                }}
                marginLeft
                marginRight
              >
                Avbryt
              </Button>
              <Button
                onClick={() => {
                  if (selectedDisclosure && submitDeleteDisclosure) {
                    submitDeleteDisclosure(selectedDisclosure).then((res) => {
                      if (res) {
                        setShowDeleteModal(false)
                      } else {
                        setShowDeleteModal(true)
                      }
                    })
                  }
                }}
              >
                Slett
              </Button>
            </Block>
          </ModalFooter>
        </Modal>
      )}
    </React.Fragment>
  )
}

export default AccordionDisclosure
