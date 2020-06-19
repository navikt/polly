import {useStyletron} from 'baseui'
import {Block} from 'baseui/block'
import {AuditButton} from '../audit/AuditButton'
import RouteLink from '../common/RouteLink'
import {SIZE as ButtonSize} from 'baseui/button'
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import * as React from 'react'
import {useEffect} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {intl, theme} from '../../util'
import {Paragraph2} from 'baseui/typography'
import {deleteInformationType, getDocumentsForInformationType, getInformationType, getPoliciesForInformationType} from '../../api'
import {InformationType} from '../../constants'
import {StyledSpinnerNext} from 'baseui/spinner'
import Button from '../common/Button'

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
  }, [props.showDeleteModal, props.id, infoType])

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
      unstable_ModalBackdropScroll={true}
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
          <Block alignSelf="flex-end">
            {errorProcessModal && <p>{errorProcessModal}</p>}
          </Block>
          <Block display='inline' marginLeft={theme.sizing.scale400}/>
          <Button
            kind="secondary"
            onClick={props.closeModal}
          >
            {intl.abort}
          </Button>
          <Block display='inline' marginLeft={theme.sizing.scale400}/>
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
  const [useCss] = useStyletron()
  const link = useCss({textDecoration: 'none'})
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  return (
    <>
      <Block alignSelf="center" display="flex">

        <AuditButton id={props.id} marginRight/>

        <RouteLink href={`/informationtype/edit/${props.id}`} className={link}>
          <Button size="compact" kind="outline" tooltip={intl.edit} icon={faEdit} marginRight>
            {intl.edit}
          </Button>
        </RouteLink>

        <Button size={ButtonSize.compact} kind='outline' onClick={() => setShowDeleteModal(true)} tooltip={intl.delete} icon={faTrash}>
          {intl.delete}
        </Button>

      </Block>
      <DeleteModal id={props.id} showDeleteModal={showDeleteModal} closeModal={() => setShowDeleteModal(false)}/>
    </>
  )
}
