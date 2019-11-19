import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import TableInformationtype from './TableInformationtype'
import { codelist, ListName } from "../../../codelist"

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
                <Panel title={codelist.getShortname(ListName.PURPOSE, key)}>
                    <TableInformationtype list={getPolicylistForPurpose(key)} />
                </Panel>
            ))}

        </Accordion>
    )
}

export default AccordionInformationtype