import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import TableInformationtype from './TableInformationtype'
import { codelist, ListName } from "../../../service/Codelist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight, faUsersCog } from "@fortawesome/free-solid-svg-icons"
import { intl } from "../../../util/intl/intl"

export interface AccordionInformationtypeProps {
    purposeMap: any;
    expaneded: string[];
    onChange?: (args: { expanded: React.Key[] }) => any;
}

const AccordionInformationtype = (props: AccordionInformationtypeProps) => {
    const {purposeMap, onChange, expaneded} = props
    if (!purposeMap) return <Paragraph2>{intl.purposeNotFound}</Paragraph2>
    if (!codelist.isLoaded()) return <Paragraph2>{intl.couldntLoad}</Paragraph2>

    const getPolicylistForPurpose = (purpose: any) => {
        return !purposeMap[purpose] ? [] : purposeMap[purpose]
    }

    return (
        <Accordion initialState={{expanded: expaneded}} onChange={onChange}>
            {Object.keys(purposeMap).map((key: any) => (
                <Panel title={<span><FontAwesomeIcon icon={faUsersCog}/> {codelist.getShortname(ListName.PURPOSE, key)}</span>} key={key}
                       overrides={{
                           ToggleIcon: {component: (iconProps) => !!iconProps.$expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
                       }}
                >
                    <TableInformationtype list={getPolicylistForPurpose(key)}/>
                </Panel>
            ))}

        </Accordion>
    )
}

export default AccordionInformationtype