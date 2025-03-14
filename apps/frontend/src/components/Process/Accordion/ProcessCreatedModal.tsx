import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router'
import Button from '../../common/Button/CustomButton'

interface IProps {
  openAddPolicy: () => void
  openAddDocument: () => void
}

export const ProcessCreatedModal = (props: IProps) => {
  const { openAddPolicy, openAddDocument } = props
  const history: NavigateFunction = useNavigate()
  const location: Location<any> = useLocation()
  const closeModal = () => history(location.pathname)

  return (
    <Modal isOpen={location.search.indexOf('create') >= 0} closeable={false}>
      <ModalHeader>Behandling opprettet</ModalHeader>
      <ModalBody>
        <ParagraphMedium>Vil du legge til opplysningstyper?</ParagraphMedium>
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-end">
          <Button size="xsmall" kind="tertiary" marginRight onClick={closeModal}>
            Nei
          </Button>
          <Button
            size="xsmall"
            kind="primary"
            marginRight
            onClick={() => {
              closeModal()
              openAddPolicy()
            }}
          >
            Legg til opplysningstyper enkeltvis
          </Button>
          <Button
            size="xsmall"
            kind="primary"
            onClick={() => {
              closeModal()
              openAddDocument()
            }}
          >
            Legg til standardopplysningstyper
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
