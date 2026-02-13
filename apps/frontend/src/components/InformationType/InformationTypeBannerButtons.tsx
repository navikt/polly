import { DocPencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Modal } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import {
  deleteInformationType,
  getDocumentsForInformationType,
  getInformationType,
  getPoliciesForInformationType,
} from '../../api/GetAllApi'
import { IInformationType } from '../../constants'
import { AuditButton } from '../admin/audit/AuditButton'
import Button from '../common/Button/CustomButton'
import RouteLink from '../common/RouteLink'
import { Spinner } from '../common/Spinner'

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
    <Modal header={{ heading: 'Bekreft sletting' }} onClose={closeModal} open={showDeleteModal}>
      <Modal.Body>
        {!infoType && <Spinner />}
        {canDelete && (
          <BodyShort spacing>Bekreft sletting av opplysningstypen {infoType?.name}</BodyShort>
        )}
        {infoType && !canDelete && (
          <BodyShort spacing>
            {`Kan ikke slette opplysningstypen ${infoType.name} da den er knyttet til:`}
            {!!policies && <ul>{policies} Behandling(er)</ul>}
            {!!documents && <ul>{documents} Dokument(er)</ul>}
          </BodyShort>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="self-end">
          {errorProcessModal && <BodyShort>{errorProcessModal}</BodyShort>}
        </div>
        <Button kind="secondary" onClick={closeModal}>
          Avbryt
        </Button>
        <Button onClick={submitDeleteProcess} disabled={!canDelete}>
          Slett
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

interface IInformationTypeBannerButtonsProps {
  id: string
}

export const InformationTypeBannerButtons = (props: IInformationTypeBannerButtonsProps) => {
  const { id } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <>
      <div className="self-center flex">
        <AuditButton id={id} />

        <RouteLink href={`/informationtype/${id}/edit`} className="no-underline">
          <Button
            size="xsmall"
            kind="outline"
            marginRight
            startEnhancer={
              <span className="flex items-center leading-none">
                <DocPencilIcon aria-hidden className="block" />
              </span>
            }
          >
            Redigér
          </Button>
        </RouteLink>

        <Button
          size="xsmall"
          kind="outline"
          onClick={() => setShowDeleteModal(true)}
          startEnhancer={
            <span className="flex items-center leading-none">
              <TrashIcon aria-hidden className="block" />
            </span>
          }
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
