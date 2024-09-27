import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useStyletron } from 'baseui'
import { SIZE as ButtonSize } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { Spinner } from 'baseui/spinner'
import { ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import {
  deleteInformationType,
  getDocumentsForInformationType,
  getInformationType,
  getPoliciesForInformationType,
} from '../../api'
import { IInformationType } from '../../constants'
import { AuditButton } from '../admin/audit/AuditButton'
import Button from '../common/Button'
import RouteLink from '../common/RouteLink'

interface IDeleteModalProps {
  id: string
  showDeleteModal: boolean
  closeModal: () => void
}

export const DeleteModal = (props: IDeleteModalProps) => {
  const { showDeleteModal, id, closeModal } = props
  const [errorProcessModal, setErrorProcessModal] = useState(false)
  const [infoType, setInfoType] = useState<IInformationType>()
  const [policies, setPolicies] = useState<number>()
  const [documents, setDocuments] = useState<number>()
  const navigate: NavigateFunction = useNavigate()

  useEffect(() => {
    ;(async () => {
      if (showDeleteModal && !infoType) {
        setPolicies((await getPoliciesForInformationType(id)).totalElements)
        setDocuments((await getDocumentsForInformationType(id)).totalElements)
        setInfoType(await getInformationType(id))
      }
    })()
  }, [showDeleteModal, id, infoType])

  const submitDeleteProcess = async (): Promise<void> => {
    try {
      await deleteInformationType(id)
      navigate('/informationtype', {
        replace: true,
      })
    } catch (error: any) {
      setErrorProcessModal(error.message)
    }
  }

  const canDelete: boolean | undefined = infoType && !policies && !documents

  return (
    <Modal onClose={closeModal} isOpen={showDeleteModal} animate size="default">
      <ModalHeader>Bekreft sletting</ModalHeader>
      <ModalBody>
        {!infoType && <Spinner />}
        {canDelete && (
          <ParagraphMedium>Bekreft sletting av opplysningstypen {infoType?.name}</ParagraphMedium>
        )}
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
          <Button kind="secondary" onClick={closeModal}>
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

interface IInformationTypeBannerButtonsProps {
  id: string
}

export const InformationTypeBannerButtons = (props: IInformationTypeBannerButtonsProps) => {
  const { id } = props
  const [useCss] = useStyletron()
  const link: string = useCss({ textDecoration: 'none' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <>
      <div className="self-center flex">
        <AuditButton id={id} marginRight />

        <RouteLink href={`/informationtype/${id}/edit`} className={link}>
          <Button size="compact" kind="outline" icon={faEdit} marginRight>
            Redigér
          </Button>
        </RouteLink>

        <Button
          size={ButtonSize.compact}
          kind="outline"
          onClick={() => setShowDeleteModal(true)}
          icon={faTrash}
        >
          Slett
        </Button>
      </div>
      <DeleteModal
        id={id}
        showDeleteModal={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
      />
    </>
  )
}
