import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import TableInformationtype from './TableInformationtype'

const AccordionInformationtype = (props: any) => {
    if (!props) return null
    if (!props.purposeMap) return <Paragraph2>Fant ingen formål</Paragraph2>
    if (!props.codelist) return <Paragraph2>Fikk ikke lastet inn codelist</Paragraph2>

    const { purposeMap, codelist } = props

    const getPolicylistForPurpose = (purpose: any) => {
        return !purposeMap[purpose] ? [] : purposeMap[purpose]
    }

    return (
        <Accordion>
            {Object.keys(purposeMap).map((key: any) => (
                <Panel title={key}>
                    <TableInformationtype list={getPolicylistForPurpose(key)} codelist={codelist} />
                </Panel>
            ))}

        </Accordion>
    )
}

export default AccordionInformationtype