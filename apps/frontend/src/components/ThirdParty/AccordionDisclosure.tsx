import * as React from 'react'
import {useEffect, useState} from 'react'
import {Disclosure, DisclosureAlert, DisclosureFormValues} from "../../constants";
import {getAlertForDisclosure} from "../../api/AlertApi";
import {theme} from "../../util";
import {Block} from "baseui/block";
import {Accordion, Panel} from "baseui/accordion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";


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
            <Panel
              title={
                <Block>
                  <FontAwesomeIcon icon={faChevronRight}/>
                  <span> </span>
                  <span>{d.name}</span>
                </Block>
              }
              key={d.id}
              overrides={{
                ToggleIcon: {
                  component: () => null
                },
                Content: {
                  style: {
                    backgroundColor: theme.colors.white,
                    // Outline width
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    paddingLeft: '4px',
                    paddingRight: '4px',
                  }
                }
              }}
            >
              {/*{isLoading && <Block padding={theme.sizing.scale400}><StyledSpinnerNext size={theme.sizing.scale1200}/></Block>}*/}

              {//!isLoading && currentProcess &&
              (
                <Block $style={{
                  outline: `4px ${theme.colors.primary200} solid`
                }}>

                  <Block paddingLeft={theme.sizing.scale800} paddingRight={theme.sizing.scale800} paddingTop={theme.sizing.scale800}>
                    {/*<ProcessData process={currentProcess}/>*/}

                    <Block display='flex' justifyContent='flex-end'>
                      {/*<span><i>{intl.formatString(intl.lastModified, currentProcess.changeStamp.lastModifiedBy, lastModifiedDate(currentProcess.changeStamp.lastModifiedDate))}</i></span>*/}
                    </Block>
                    <Block display='flex' paddingTop={theme.sizing.scale800} width='100%' justifyContent='flex-end'>
                      {/*{canViewAlerts() && <Block marginRight='auto'>*/}
                      {/*  <Button type='button' kind='tertiary' size='compact' icon={faExclamationCircle}*/}
                      {/*          onClick={() => history.push(`/alert/events/process/${p.id}`)}>{intl.alerts}</Button>*/}
                      {/*</Block>}*/}
                      {/*{hasAccess() &&*/}
                      {/*<Block>*/}
                      {/*  <div ref={InformationTypeRef}></div>*/}
                      {/*  {renderAddDocumentButton()}*/}
                      {/*  {renderCreatePolicyButton()}*/}
                      {/*</Block>*/}
                      {/*}*/}
                    </Block>
                  </Block>
                </Block>
              )}
            </Panel>
          )
        })}
      </Accordion>

    </React.Fragment>
  )
}

export default AccordionDisclosure
