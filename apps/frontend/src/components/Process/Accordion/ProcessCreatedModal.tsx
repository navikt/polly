import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { Block } from 'baseui/block'
import Button from '../../common/Button'
import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ParagraphMedium } from 'baseui/typography'

export const ProcessCreatedModal = (props: { openAddPolicy: () => void; openAddDocument: () => void }) => {
  const history = useNavigate()
  const location = useLocation()
  const closeModal = () => history(location.pathname)

  return (
    <Modal isOpen={location.search.indexOf('create') >= 0} closeable={false}>
      <ModalHeader>Behandling opprettet</ModalHeader>
      <ModalBody>
        <ParagraphMedium>Vil du legge til opplysningstyper?</ParagraphMedium>
      </ModalBody>
      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Button size="compact" kind="tertiary" marginRight onClick={closeModal}>
            Nei
          </Button>
          <Button
            size="compact"
            kind="primary"
            marginRight
            onClick={() => {
              closeModal()
              props.openAddPolicy()
            }}
          >
            Legg til opplysningstyper enkeltvis
          </Button>
          <Button
            size="compact"
            kind="primary"
            onClick={() => {
              closeModal()
              props.openAddDocument()
            }}
          >
            Legg til standardopplysningstyper
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
