import * as React from 'react'
import {useEffect, useState} from 'react'
import {Disclosure, DisclosureAlert, DisclosureFormValues} from "../../constants";
import {getAlertForDisclosure} from "../../api/AlertApi";
import {intl, theme} from "../../util";
import {Block} from "baseui/block";
import {Accordion, Panel} from "baseui/accordion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import {getDisclosure} from "../../api";
import {StyledSpinnerNext} from "baseui/spinner";
import DataText from "../common/DataText";
import {DotTags} from "../common/DotTag";
import {canViewAlerts} from "../../pages/AlertEventPage";
import Button from "../common/Button";
import {useHistory} from 'react-router-dom'


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
  const [isLoading, setLoading] = useState<boolean>(false)
  const history = useHistory()

  const {disclosureList, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal} = props

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
        onChange={({expanded}) => {
          if (expanded.length > 0) {
            (async () => {
              setLoading(true)
              const disclosureId = expanded[0].toString()
              setSelectedDisclosure(await getDisclosure(disclosureId))
              setLoading((false))
            })()
          }
        }}
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
              {isLoading ? <Block padding={theme.sizing.scale400}><StyledSpinnerNext size={theme.sizing.scale1200}/></Block> :
                <Block $style={{
                  outline: `4px ${theme.colors.primary200} solid`
                }}>
                  <Block padding={theme.sizing.scale800}>
                    <Block width='100%'>
                      <DataText label={intl.name} text={selectedDisclosure?.name}/>
                      <DataText label={intl.document} text={selectedDisclosure?.document?.name}/>
                      <DataText label={intl.description} text={selectedDisclosure?.description}/>
                      <DataText label={intl.informationTypes} children={<DotTags items={selectedDisclosure?.informationTypes?.map(i=>i.name)}/>}/>
                      <DataText label={intl.processes} children={<DotTags items={selectedDisclosure?.processes?.map(p=>p.name)}/>}/>
                      {selectedDisclosure && alerts[selectedDisclosure.id].missingArt6 && canViewAlerts() &&
                      <DataText label={intl.alerts} children={
                        <Button type='button' kind='tertiary' size='compact'
                                icon={faExclamationCircle} tooltip={alerts[selectedDisclosure.id].missingArt6 ? `${intl.alerts}: ${intl.MISSING_ARTICLE_6}` : `${intl.alerts}: ${intl.no}`}
                                $style={{color: alerts[selectedDisclosure.id].missingArt6 ? theme.colors.warning500 : undefined}}
                                onClick={() => history.push(`/alert/events/disclosure/${selectedDisclosure.id}`)}
                        />
                      }/>
                      }
                    </Block>
                  </Block>
                </Block>
              }
            </Panel>
          )
        })}
      </Accordion>

    </React.Fragment>
  )
}

export default AccordionDisclosure
