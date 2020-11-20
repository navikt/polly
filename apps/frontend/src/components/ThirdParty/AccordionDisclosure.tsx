import * as React from 'react'
import { useEffect, useState } from 'react'
import { Disclosure, DisclosureAlert, DisclosureFormValues } from "../../constants";
import { getAlertForDisclosure } from "../../api/AlertApi";
import { mapDisclosureToFormValues } from "../../api";
import ModalThirdParty from "./ModalThirdPartyForm";
import { intl } from "../../util";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "baseui/modal";
import { Paragraph2 } from "baseui/typography";
import { Block } from "baseui/block";
import Button from "../common/Button";
import { useHistory } from 'react-router-dom'
import { Accordion, Panel, StatelessAccordion } from "baseui/accordion";


type AccordionDisclosureProps = {
  disclosureList: Array<Disclosure>;
  showRecipient: boolean;
  editable: boolean;
  submitDeleteDisclosure?: (disclosure: Disclosure) => Promise<boolean>;
  submitEditDisclosure?: (disclosure: DisclosureFormValues) => Promise<boolean>;
  errorModal?: string;
  onCloseModal?: () => void;
};

type Alerts = { [k: string]: DisclosureAlert }

const AccordionDisclosure = (props: AccordionDisclosureProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false)
  const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()
  const [alerts, setAlerts] = useState<Alerts>({})

  const { disclosureList, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal } = props


  useEffect(() => {
    (async () => {
      const alertMap = (await Promise.all(disclosureList.map(d => getAlertForDisclosure(d.id))))
        .reduce((acc: Alerts, alert) => {
          acc[alert.disclosureId] = alert
          return acc
        }, {} as Alerts)
      setAlerts(alertMap)
    })()
  }, [disclosureList])

  return (
    <React.Fragment>
      <Accordion
        onChange={({ expanded }) => console.log("Changed", expanded)}
      >
        {disclosureList && disclosureList.sort((a, b) => a.name.localeCompare(b.name)).map((d: Disclosure) => {

          return (
            <Panel>
              {d.name}
            </Panel>
          )
        })}
      </Accordion>

    </React.Fragment>
  )
}

export default AccordionDisclosure
