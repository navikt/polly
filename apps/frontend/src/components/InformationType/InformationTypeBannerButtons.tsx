import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useStyletron } from 'baseui'
import { SIZE as ButtonSize } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { Spinner } from 'baseui/spinner'
import { ParagraphMedium } from 'baseui/typography'
import * as React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteInformationType, getDocumentsForInformationType, getInformationType, getPoliciesForInformationType } from '../../api'
import { InformationType } from '../../constants'
import { AuditButton } from '../admin/audit/AuditButton'
import Button from '../common/Button'
import RouteLink from '../common/RouteLink'

export const DeleteModal = (props: { id: string; showDeleteModal: boolean; closeModal: () => void }) => {
  const [errorProcessModal, setErrorProcessModal] = React.useState(false)
  const [infoType, setInfoType] = React.useState<InformationType>()
  const [policies, setPolicies] = React.useState<number>()
  const [documents, setDocuments] = React.useState<number>()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
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
      navigate('/informationtype', {
        replace: true,
      })
    } catch (e: any) {
      setErrorProcessModal(e.message)
    }
  }

  const canDelete = infoType && !policies && !documents

  return (
    <Modal onClose={props.closeModal} isOpen={props.showDeleteModal} animate size="default">
      <ModalHeader>Bekreft sletting</ModalHeader>
      <ModalBody>
        {!infoType && <Spinner />}
        {canDelete && <ParagraphMedium>Bekreft sletting av opplysningstypen {infoType?.name}</ParagraphMedium>}
        {infoType && !canDelete && (
          <ParagraphMedium>
            {`Kan ikke slette opplysningstypen ${infoType.name} da den er knyttet til:`}
            {!!policies && <ul>{policies} Behandling(er)</ul>}
            {!!documents && <ul>{documents} Dokument(er)</ul>}
          </ParagraphMedium>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <div className="self-end">{errorProcessModal && <p>{errorProcessModal}</p>}</div>
          <div className="inline ml-2.5" />
          <Button kind="secondary" onClick={props.closeModal}>
            Avbryt
          </Button>
          <div className="inline ml-2.5" />
          <Button onClick={submitDeleteProcess} disabled={!canDelete}>
            Slett
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export const InformationTypeBannerButtons = (props: { id: string }) => {
  const [useCss] = useStyletron()
  const link = useCss({ textDecoration: 'none' })
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)

  return (
    <>
      <div className="self-center flex">
        <AuditButton id={props.id} marginRight />

        <RouteLink href={`/informationtype/${props.id}/edit`} className={link}>
          <Button size="compact" kind="outline" icon={faEdit} marginRight>
            Redigér
          </Button>
        </RouteLink>

        <Button size={ButtonSize.compact} kind="outline" onClick={() => setShowDeleteModal(true)} icon={faTrash}>
          Slett
        </Button>
      </div>
      <DeleteModal id={props.id} showDeleteModal={showDeleteModal} closeModal={() => setShowDeleteModal(false)} />
    </>
  )
}
