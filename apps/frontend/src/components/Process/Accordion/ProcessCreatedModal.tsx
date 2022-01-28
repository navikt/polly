import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {intl} from '../../../util'
import {Block} from 'baseui/block'
import Button from '../../common/Button'
import * as React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {Paragraph2} from 'baseui/typography'


export const ProcessCreatedModal = (props: {openAddPolicy: () => void, openAddDocument: () => void}) => {
  const history = useNavigate()
  const location = useLocation()
  const closeModal = () => history(location.pathname)

  return (
    <Modal isOpen={location.search.indexOf('create') >= 0} closeable={false}>
      <ModalHeader>{intl.processCreated}</ModalHeader>
      <ModalBody>
        <Paragraph2>{intl.doYouWantToAddPolicies}</Paragraph2>
      </ModalBody>
      <ModalFooter>
        <Block display='flex' justifyContent='flex-end'>
          <Button size='compact' kind='tertiary' marginRight onClick={closeModal}>{intl.no}</Button>
          <Button size='compact' kind='primary' marginRight onClick={() => {
            closeModal()
            props.openAddPolicy()
          }}>{intl.addPolicies}</Button>
          <Button size='compact' kind='primary' onClick={() => {
            closeModal()
            props.openAddDocument()
          }}>{intl.addDefaultDocument}</Button>
        </Block>
      </ModalFooter>

    </Modal>
  )
}
