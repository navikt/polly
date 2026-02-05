import { BodyShort, Modal } from '@navikt/ds-react'
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
    <Modal
      header={{ heading: 'Behandling opprettet', closeButton: false }}
      open={location.search.indexOf('create') >= 0}
      onClose={closeModal}
    >
      <Modal.Body>
        <BodyShort spacing>Vil du legge til opplysningstyper?</BodyShort>
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  )
}
