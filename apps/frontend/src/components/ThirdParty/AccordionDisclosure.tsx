import { faEdit, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Accordion, Modal } from '@navikt/ds-react'
import { StyledLink } from 'baseui/link'
import { Spinner } from 'baseui/spinner'
import { ParagraphMedium, ParagraphSmall } from 'baseui/typography'
import { Fragment, Key, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { convertDisclosureToFormValues, getDisclosure } from '../../api/GetAllApi'
import {
  IDisclosure,
  IDisclosureAbroad,
  IDisclosureFormValues,
  IInformationTypeShort,
  ILegalBasis,
} from '../../constants'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { CodelistService, EListName } from '../../service/Codelist'
import { user } from '../../service/User'
import { theme } from '../../util'
import { lastModifiedDate } from '../../util/date-formatter'
import { shortenLinksInText } from '../../util/helper-functions'
import Button from '../common/Button/CustomButton'
import DataText from '../common/DataText'
import { DotTags } from '../common/DotTag'
import { LegalBasisView } from '../common/LegalBasis'
import { TeamList } from '../common/Team'
import ModalThirdParty from './ModalThirdPartyForm'
import LinkListInformationType from './components/LinkListInformationType'
import LinkListProcess from './components/LinkListProcess'

type TAccordionDisclosureProps = {
  disclosureList: Array<IDisclosure>
  showRecipient: boolean
  editable: boolean
  submitDeleteDisclosure?: (disclosure: IDisclosure) => Promise<boolean>
  submitEditDisclosure?: (disclosure: IDisclosureFormValues) => Promise<boolean>
  errorModal?: string
  onCloseModal?: () => void
  expand?: string
}

const showAbroad = (abroad: IDisclosureAbroad) => {
  if (abroad.abroad === true) {
    if (abroad.refToAgreement) {
      return (
        <>
          <DataText label="Utleveres personopplysningene til utlandet?">
            <div>
              {'Ja. Referanse'}
              {shortenLinksInText(abroad.refToAgreement)}
            </div>
          </DataText>
          {abroad.businessArea && <DataText label="Trygdeområde" text={abroad.businessArea} />}
        </>
      )
    } else {
      return (
        <>
          <DataText label="Utleveres personopplysningene til utlandet?">Ja</DataText>
          {abroad.businessArea && <DataText label="Trygdeområde" text={abroad.businessArea} />}
        </>
      )
    }
  } else if (abroad.abroad === false) {
    return <DataText label="Utleveres personopplysningene til utlandet?" text="Nei" />
  } else {
    return <DataText label="Utleveres personopplysningene til utlandet?" text="Uavklart" />
  }
}

const AccordionDisclosure = (props: TAccordionDisclosureProps) => {
  const { expand } = props
  const [codelistUtils] = CodelistService()

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedDisclosure, setSelectedDisclosure] = useState<IDisclosure>()
  const [isLoading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [hasAlert, setHasAlert] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<Key[]>(expand ? [expand] : [])

  const {
    disclosureList,
    showRecipient,
    submitDeleteDisclosure,
    submitEditDisclosure,
    errorModal,
    editable,
    onCloseModal,
  } = props

  useEffect(() => {
    expand && renewDisclosureDetails(expand)
  }, [expand])

  const renewDisclosureDetails = async (disclosureId: string) => {
    setLoading(true)
    const disc = await getDisclosure(disclosureId)
    setSelectedDisclosure(disc)
    const alert = await getAlertForDisclosure(disclosureId)
    setHasAlert(alert.missingArt6)
    setLoading(false)
  }

  return (
    <Fragment>
      <Accordion>
        {disclosureList &&
          disclosureList
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((disclosure: IDisclosure) => {
              return (
                <Accordion.Item
                  key={disclosure.id}
                  open={disclosure.id === expanded[0]}
                  onOpenChange={(expanded) => {
                    if (expanded) {
                      renewDisclosureDetails(disclosure.id)
                      setExpanded([disclosure.id])
                    } else {
                      setExpanded([])
                    }
                  }}
                >
                  <Accordion.Header>{disclosure.name}</Accordion.Header>
                  <Accordion.Content>
                    {editable && (
                      <div className=" w-full flex justify-end mb-5">
                        {selectedDisclosure && hasAlert && canViewAlerts() && (
                          <Button
                            kind={'outline'}
                            size="xsmall"
                            icon={faExclamationCircle}
                            marginRight
                            tooltip={
                              hasAlert
                                ? 'Varsler: Behandlingsgrunnlag for artikkel 6 mangler'
                                : 'Varsler: Nei'
                            }
                            onClick={() =>
                              navigate(`/alert/events/disclosure/${selectedDisclosure.id}`)
                            }
                          >
                            Varsler
                          </Button>
                        )}
                        {user.isLoggedIn() && (
                          <>
                            <Button
                              kind={'outline'}
                              size="xsmall"
                              icon={faEdit}
                              onClick={() => setShowEditModal(true)}
                              marginRight
                            >
                              Redigér
                            </Button>

                            <Button
                              kind={'outline'}
                              size="xsmall"
                              icon={faTrash}
                              onClick={() => setShowDeleteModal(true)}
                            >
                              Slett
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {isLoading && (
                      <div className="p-2.5">
                        <Spinner $size={theme.sizing.scale1200} />
                      </div>
                    )}

                    {!isLoading && (
                      <div className="outline outline-4 outline-[#E2E2E2]">
                        <div className="p-6">
                          <div className="w-full">
                            {showRecipient && (
                              <DataText
                                label="Mottaker"
                                text={selectedDisclosure?.recipient.shortName}
                              />
                            )}
                            <DataText label="Navn på utlevering" text={selectedDisclosure?.name} />
                            <DataText
                              label="Formål med utlevering"
                              text={selectedDisclosure?.recipientPurpose}
                            />
                            <DataText
                              label="Ytterligere beskrivelse"
                              text={selectedDisclosure?.description}
                            />

                            <DataText label="Relaterte behandlinger">
                              {LinkListProcess(
                                selectedDisclosure?.processes ? selectedDisclosure?.processes : []
                              )}
                            </DataText>

                            <DataText label="Opplysningstyper">
                              {LinkListInformationType(
                                selectedDisclosure?.informationTypes
                                  ? selectedDisclosure?.informationTypes.map(
                                      (informationType: IInformationTypeShort) => informationType
                                    )
                                  : []
                              )}
                            </DataText>

                            <DataText label="Dokument">
                              {selectedDisclosure?.documentId && (
                                <StyledLink
                                  href={`/document/${selectedDisclosure?.documentId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {selectedDisclosure?.document?.name}
                                </StyledLink>
                              )}
                              {!selectedDisclosure?.documentId && 'Ikke angitt'}
                            </DataText>

                            {selectedDisclosure?.legalBases.length ? (
                              <DataText label="Behandlingsgrunnlag for hele behandlingen" text={''}>
                                {selectedDisclosure.legalBases
                                  .sort((a: ILegalBasis, b: ILegalBasis) =>
                                    codelistUtils
                                      .getShortname(EListName.GDPR_ARTICLE, a.gdpr.code)
                                      .localeCompare(
                                        codelistUtils.getShortname(
                                          EListName.GDPR_ARTICLE,
                                          b.gdpr.code
                                        )
                                      )
                                  )
                                  .map((legalBasis, index) => (
                                    <div key={index}>
                                      <LegalBasisView legalBasis={legalBasis} />
                                    </div>
                                  ))}
                              </DataText>
                            ) : (
                              <>
                                <DataText
                                  label="Behandlingsgrunnlag for hele behandlingen"
                                  text="Ikke angitt"
                                />
                              </>
                            )}
                          </div>
                          {selectedDisclosure && showAbroad(selectedDisclosure?.abroad)}

                          <div>
                            <DataText
                              label="Hjemmel for unntak fra taushetsplikt er vurdert"
                              text={
                                disclosure.assessedConfidentiality !== null
                                  ? disclosure.assessedConfidentiality
                                    ? 'Ja'
                                    : 'Nei'
                                  : 'Ikke angitt'
                              }
                            />

                            {disclosure.assessedConfidentiality !== null && (
                              <DataText
                                label={
                                  disclosure.assessedConfidentiality
                                    ? 'Hjemmel for unntak fra taushetsplikt, og ev. referanse til vurderingen'
                                    : 'Begrunnelse for at hjemmel for unntak for taushetsplikt ikke er vurdert'
                                }
                                text=""
                              >
                                {shortenLinksInText(
                                  disclosure.confidentialityDescription
                                    ? disclosure.confidentialityDescription
                                    : 'Ikke angitt'
                                )}
                              </DataText>
                            )}
                          </div>

                          <div>
                            <DataText label="Avdeling">
                              {disclosure.department?.code && (
                                <DotTags
                                  list={EListName.DEPARTMENT}
                                  codes={[disclosure.department]}
                                  commaSeparator
                                  linkCodelist
                                  codelistUtils={codelistUtils}
                                />
                              )}
                              {!disclosure.department?.code && 'Ikke angitt'}
                            </DataText>

                            <DataText label="Team">
                              {disclosure.productTeams?.length ? (
                                <TeamList teamIds={disclosure.productTeams} />
                              ) : (
                                'Ikke angitt'
                              )}
                            </DataText>
                          </div>
                        </div>
                        <div className="flex justify-end mb-4 mr-4">
                          <ParagraphSmall>
                            {selectedDisclosure && (
                              <i>
                                {`Sist endret av ${selectedDisclosure?.changeStamp?.lastModifiedBy} ,
                              ${lastModifiedDate(selectedDisclosure?.changeStamp?.lastModifiedDate)}`}
                              </i>
                            )}
                          </ParagraphSmall>
                        </div>
                      </div>
                    )}
                  </Accordion.Content>
                </Accordion.Item>
              )
            })}
      </Accordion>
      {editable && showEditModal && selectedDisclosure && (
        <ModalThirdParty
          title="Rediger utlevering"
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
        <Modal
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          header={{ heading: 'Bekreft sletting' }}
        >
          <Modal.Body>
            <ParagraphMedium>
              Bekreft sletting av utlevering {selectedDisclosure?.name}
            </ParagraphMedium>
          </Modal.Body>

          <Modal.Footer>
            <div className="flex justify-end">
              <div className="self-end">{errorModal && <p>{errorModal}</p>}</div>
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
                    submitDeleteDisclosure(selectedDisclosure).then((response: boolean) => {
                      if (response) {
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
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </Fragment>
  )
}

export default AccordionDisclosure
