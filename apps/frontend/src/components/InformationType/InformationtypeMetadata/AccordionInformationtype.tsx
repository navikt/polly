import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import TableInformationtype from './TableInformationtype'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight, faUsersCog } from "@fortawesome/free-solid-svg-icons"

import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util"
import { PurposeMap } from "../../../pages/InformationtypePage"

export interface AccordionInformationtypeProps {
    purposeMap: PurposeMap;
    expaneded: string[];
    onChange?: (args: { expanded: React.Key[] }) => void;
}

const AccordionInformationtype = (props: AccordionInformationtypeProps) => {
    const {purposeMap, onChange, expaneded} = props
    if (!purposeMap) return <Paragraph2>{intl.purposeNotFound}</Paragraph2>
    if (!codelist.isLoaded()) return <Paragraph2>{intl.couldntLoad}</Paragraph2>

    const getPolicylistForPurpose = (purpose: string) => {
        return !purposeMap[purpose] ? [] : purposeMap[purpose]
    }

    return (
        <Accordion initialState={{expanded: expaneded}} onChange={onChange}>
            {Object.keys(purposeMap).map((key) => (
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