import { BodyShort, Button, Heading, Link, List, Modal } from '@navikt/ds-react'
import { IDisclosure, IProcess } from '../../../constants'
import { user } from '../../../service/User'

interface IDeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  process: IProcess
  submitDeleteProcess: (process: IProcess) => Promise<boolean>
  errorProcessModal: string
  disclosures: IDisclosure[]
}

export const DeleteProcessModal = (props: IDeleteProcessProps) => {
  const { process, onClose, isOpen, submitDeleteProcess, errorProcessModal, disclosures } = props

  return (
    <Modal header={{ heading: 'Bekreft sletting' }} onClose={onClose} open={isOpen}>
      <Modal.Body>
        <BodyShort spacing>
          Er du sikker på at du vil slette behandlingen? Dersom behandlingen er opphørt skal
          gyldighetsperiode oppdateres.
        </BodyShort>

        {!user.isAdmin() && (
          <BodyShort>
            For å slette behandlingen, kontakt oss på{' '}
            <Link target="_blank" href="https://nav-it.slack.com/archives/CR1B19E6L">
              slack
            </Link>
            .
          </BodyShort>
        )}

        {user.isAdmin() && (
          <div>
            {!process.policies.length && (
              <BodyShort spacing>Bekreft sletting av behandlingen {process.name}</BodyShort>
            )}
            {(!!process.policies.length || !!disclosures.length) && (
              <List as="ul">
                <Heading size="medium">Disse koblingene må fjernes</Heading>
                {!!process.policies.length && (
                  <List.Item>{`Kan ikke slette behandlingen ${process.name}, den inneholder fortsatt ${process.policies.length} opplysningstype(r)`}</List.Item>
                )}
                {!!disclosures.length && (
                  <List.Item>
                    Du kan ikke slette behandlinger med eksisterende utleveringer.
                  </List.Item>
                )}
              </List>
            )}
          </div>
        )}
      </Modal.Body>

      {user.isAdmin() && (
        <Modal.Footer>
          <div className="self-end">
            {errorProcessModal && <BodyShort>{errorProcessModal}</BodyShort>}
          </div>
          <Button
            onClick={() => {
              submitDeleteProcess(process).then(onClose)
            }}
            disabled={!!process.policies.length || !!disclosures.length}
          >
            Slett
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}
