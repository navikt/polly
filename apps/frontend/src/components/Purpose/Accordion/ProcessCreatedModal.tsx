import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { intl } from '../../../util'
import { Block } from 'baseui/block'
import Button from '../../common/Button'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'


const ProcessCreatedModalImpl = (props: { openAddPolicy: () => void } & RouteComponentProps<any>) => {
  const onClose = () => props.history.push(props.location.pathname)

  return (
    <Modal isOpen={props.history.location.search.indexOf('create') >= 0} closeable={false}>
      <ModalHeader>{intl.processCreated}</ModalHeader>
      <ModalBody>{intl.doYouWantToAddPolicies}</ModalBody>
      <ModalFooter>
        <Block display='flex' justifyContent='flex-end'>
          <Button kind='tertiary' onClick={onClose} marginRight>{intl.no}</Button>
          <Button kind='primary' onClick={async () => {
            onClose()
            props.openAddPolicy()
          }}>{intl.yes}</Button>
        </Block>
      </ModalFooter>

    </Modal>
  )
}

export const ProcessCreatedModal = withRouter(ProcessCreatedModalImpl)
