import * as React from 'react'
import { useEffect, useState } from 'react'
import { Disclosure, DisclosureAbroad, DisclosureAlert, DisclosureFormValues, ObjectType } from '../../constants'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { intl, theme } from '../../util'
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
          <DataText label={intl.deliverAbroad}>
            <Block>
              {`${intl.yes}. ${intl.reference}`}
              {shortenLinksInText(abroad.refToAgreement)}
            </Block>
          </DataText>
          {abroad.businessArea && <DataText label={intl.socialSecurityArea} text={abroad.businessArea} />}
        </>
      )
    } else {
      return (
        <>
          <DataText label={intl.deliverAbroad} children={intl.yes} />
          {abroad.businessArea && <DataText label={intl.socialSecurityArea} text={abroad.businessArea} />}
        </>
      )
    }
  } else if (abroad.abroad === false) {
    return <DataText label={intl.deliverAbroad} text={intl.no} />
  } else {
    return <DataText label={intl.deliverAbroad} text={intl.unclarified} />
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
              console.log(d.assessedConfidentiality)
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
                                      tooltip={hasAlert ? `${intl.alerts}: ${intl.MISSING_ARTICLE_6}` : `${intl.alerts}: ${intl.no}`}
                                      onClick={() => navigate(`/alert/events/disclosure/${selectedDisclosure.id}`)}
                                    >
                                      {intl.alerts}
                                    </Button>
                                  )}
                                  {user.isLoggedIn() && (
                                    <>
                                      <Button kind={'outline'} size={ButtonSize.compact} icon={faEdit} tooltip={intl.edit} onClick={() => setShowEditModal(true)} marginRight>
                                        {intl.edit}
                                      </Button>

                                      <Button kind={'outline'} size={ButtonSize.compact} icon={faTrash} tooltip={intl.delete} onClick={() => setShowDeleteModal(true)}>
                                        {intl.delete}
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
                          <DataText label={intl.disclosureName} text={selectedDisclosure?.name} />
                          <DataText label={intl.disclosurePurpose} text={selectedDisclosure?.recipientPurpose} />
                          <DataText label={intl.additionalDescription} text={selectedDisclosure?.description} />

                          <DataText label={intl.relatedProcesses}>
                            {LinkListProcess(selectedDisclosure?.processes ? selectedDisclosure?.processes : [], '/process/purpose', ObjectType.PROCESS)}
                          </DataText>

                          <DataText label={intl.informationTypes}>
                            {LinkListInformationType(
                              selectedDisclosure?.informationTypes ? selectedDisclosure?.informationTypes.map((p) => p) : [],
                              '/informationtype',
                              ObjectType.INFORMATION_TYPE,
                            )}
                          </DataText>

                          <DataText
                            label={intl.document}
                            children={
                              selectedDisclosure?.documentId ? (
                                <StyledLink href={`/document/${selectedDisclosure?.documentId}`} target="_blank" rel="noopener noreferrer">
                                  {selectedDisclosure?.document?.name}
                                </StyledLink>
                              ) : (
                                <>{intl.emptyMessage}</>
                              )
                            }
                          />

                          {selectedDisclosure?.legalBases.length ? (
                            <DataText label={intl.legalBasis} text={''}>
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
                              <DataText label={intl.legalBasis} text={intl.emptyMessage} />
                            </>
                          )}
                        </Block>
                        {selectedDisclosure && showAbroad(selectedDisclosure?.abroad)}


                        <Block>
                          <DataText label={intl.confidentialityAssessment} text={d.assessedConfidentiality !== null ? d.assessedConfidentiality ? intl.yes : intl.no : intl.emptyMessage} />

                          {
                            d.assessedConfidentiality !== null && (
                              <DataText label={d.assessedConfidentiality ? intl.confidentialityDescriptionYes : intl.confidentialityDescriptionNo} text="">
                                {shortenLinksInText(d.confidentialityDescription ? d.confidentialityDescription : intl.emptyMessage)}
                              </DataText>
                            )
                          }

                        </Block>

                      </Block>
                      <Block display="flex" justifyContent="flex-end" marginBottom={theme.sizing.scale600} marginRight={theme.sizing.scale600}>
                        <ParagraphSmall>
                          {selectedDisclosure && (
                            <i>
                              {intl.formatString(
                                intl.lastModified,
                                selectedDisclosure?.changeStamp?.lastModifiedBy,
                                lastModifiedDate(selectedDisclosure?.changeStamp?.lastModifiedDate),
                              )}
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
          title={intl.editDisclosure}
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
          <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
          <ModalBody>
            <ParagraphMedium>
              {intl.confirmDeletePolicyText} {selectedDisclosure?.name}
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
                {intl.abort}
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
                {intl.delete}
              </Button>
            </Block>
          </ModalFooter>
        </Modal>
      )}
    </React.Fragment>
  )
}

export default AccordionDisclosure
