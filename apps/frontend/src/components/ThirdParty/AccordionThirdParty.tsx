import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion';
import { Disclosure } from '../../constants';

type AccordionThirdPartyProps = {
    disclosureList: Array<Disclosure>;
}

const AccordionThirdParty = (props: AccordionThirdPartyProps) => {
    const { disclosureList } = props

    return (
        <Accordion>
            {disclosureList.length > 0 && (
                <Panel>
                    Text
                </Panel>
            )}
        </Accordion>
    )
}