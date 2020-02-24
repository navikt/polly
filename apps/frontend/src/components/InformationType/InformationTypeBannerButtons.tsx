import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { AuditButton } from "../audit/AuditButton"
import RouteLink from "../common/RouteLink"
import { Button, KIND, SIZE as ButtonSize } from "baseui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"
import * as React from "react"
import { useEffect } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "baseui/modal"
import { intl } from "../../util"
import { Paragraph2 } from "baseui/typography"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { deleteInformationType, getDocumentsForInformationType, getInformationType, getPoliciesForInformationType } from "../../api"
import { InformationType } from "../../constants"
import { StyledSpinnerNext } from "baseui/spinner"

const DeleteModalImpl = (props: RouteComponentProps<any> & { id: string, showDeleteModal: boolean, closeModal: () => void }) => {
  const [errorProcessModal, setErrorProcessModal] = React.useState(false)
  const [infoType, setInfoType] = React.useState<InformationType>()
  const [policies, setPolicies] = React.useState<number>()
  const [documents, setDocuments] = React.useState<number>()


  useEffect(() => {
    (async () => {
      if (props.showDeleteModal && !infoType) {
        setPolicies((await getPoliciesForInformationType(props.id)).totalElements)
        setDocuments((await getDocumentsForInformationType(props.id)).totalElements)
        setInfoType(await getInformationType(props.id))
      }
    })()
  }, [props.showDeleteModal, props.id])

  const submitDeleteProcess = async () => {
    try {
      await deleteInformationType(props.id)
      props.history.replace('/informationtype')
    } catch (e) {
      setErrorProcessModal(e.message)
    }
  }

  const canDelete = infoType && !policies && !documents

  return (
    <Modal
      onClose={props.closeModal}
      isOpen={props.showDeleteModal}
      animate
      size="default"
    >
      <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
      <ModalBody>
        {!infoType && <StyledSpinnerNext/>}
        {canDelete && <Paragraph2>{intl.confirmDeleteInformationTypeText} {infoType?.name}</Paragraph2>}
        {infoType && !canDelete && <Paragraph2>
          {intl.formatString(intl.cannotDeleteInformationTypes, infoType.name)}
          <br/>
          {!!policies && intl.formatString(intl.informationTypeHasPolicies, policies)}
          <br/>
          {!!documents && intl.formatString(intl.informationTypeHasDocuments, documents)}
        </Paragraph2>}
      </ModalBody>

      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Block alignSelf="flex-end">{errorProcessModal &&
          <p>{errorProcessModal}</p>}</Block>
          <Button
            kind="secondary"
            onClick={props.closeModal}
            overrides={{
              BaseButton: {
                style: {
                  marginRight: '1rem',
                  marginLeft: '1rem'
                }
              }
            }}
          >
            {intl.abort}
          </Button>
          <Button onClick={submitDeleteProcess} disabled={!canDelete}>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}

export const DeleteModal = withRouter(DeleteModalImpl)

export const InformationTypeBannerButtons = (props: { id: string }) => {
  const [useCss, theme] = useStyletron()
  const link = useCss({textDecoration: 'none'});
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  return (
    <>
      <Block alignSelf="center" marginTop="10px" display="flex">

        <AuditButton id={props.id}/>

        <Block marginRight={theme.sizing.scale500}>
          <RouteLink href={`/informationtype/edit/${props.id}`} className={link}>
            <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
              <Button size="compact" kind="secondary">
                <FontAwesomeIcon icon={faEdit}/>
              </Button>
            </StatefulTooltip>
          </RouteLink>
        </Block>

        <Block>
          <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
            <Button size={ButtonSize.compact} kind={KIND.secondary} onClick={() => setShowDeleteModal(true)}>
              <FontAwesomeIcon icon={faTrash}/>
            </Button>
          </StatefulTooltip>
        </Block>

      </Block>
      <DeleteModal id={props.id} showDeleteModal={showDeleteModal} closeModal={() => setShowDeleteModal(false)}/>
    </>
  )
}
