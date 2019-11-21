import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import TableInformationtype from './TableInformationtype'
import { codelist, ListName } from "../../../service/Codelist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsersCog } from "@fortawesome/free-solid-svg-icons"

const AccordionInformationtype = (props: any) => {
    if (!props) return null
    if (!props.purposeMap) return <Paragraph2>Fant ingen formål</Paragraph2>
    if (!codelist.isLoaded()) return <Paragraph2>Fikk ikke lastet inn codelist</Paragraph2>

    const { purposeMap } = props

    const getPolicylistForPurpose = (purpose: any) => {
        return !purposeMap[purpose] ? [] : purposeMap[purpose]
    }

    return (
        <Accordion>
            {Object.keys(purposeMap).map((key: any) => (
                <Panel title={<span><FontAwesomeIcon icon={faUsersCog}  /> {codelist.getShortname(ListName.PURPOSE, key)}</span>} key={key}>
                    <TableInformationtype list={getPolicylistForPurpose(key)} />
                </Panel>
            ))}

        </Accordion>
    )
}

export default AccordionInformationtype