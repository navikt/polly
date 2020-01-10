import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Label2 } from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import { InformationType, Policy, Disclosure } from "../../../constants"
import { intl } from "../../../util"
import Metadata from "./Metadata";
import TableInformationtype from "./TableInformationtype"
import { Button } from "baseui/button"
import TableDisclosure from "../../common/TableDisclosure";

const sectionBlockProps: BlockProps = {
    marginTop: '3rem'
}

interface InformationtypeMetadataProps {
    informationtype: InformationType;
    policies: Policy[];
    disclosures: Disclosure[],
    expanded: string[]
    onSelectPurpose: (purpose: string) => void
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
    const {informationtype, policies, disclosures, expanded, onSelectPurpose} = props
    const [accordion, setAccordion] = React.useState(false);

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    <Metadata informationtype={informationtype}/>

                    <Block {...sectionBlockProps}>
                        <Block display="flex" justifyContent="space-between" marginBottom="2rem">
                            <Label2 font="font450">{intl.purposeUse}</Label2>
                            <Button onClick={() => setAccordion(!accordion)} type="button" size="compact" kind="secondary">{accordion ? intl.showAll : intl.groupByPurpose}</Button>
                        </Block>
                        {accordion &&
                        <AccordionInformationtype policies={policies} expaneded={expanded}
                                                  onChange={args => args.expanded.length && onSelectPurpose(args.expanded[0] as string)}/>
                        }
                        {!accordion &&
                        <TableInformationtype list={policies} showPurpose={true}/>
                        }
                    </Block>

                    <Block {...sectionBlockProps}>
                        <Label2 font="font450" marginBottom="2rem">{intl.disclosuresToThirdParty}</Label2>
                        <TableDisclosure 
                            list={disclosures}
                            showRecipient
                            editable={false}
                            onCloseModal={() => console.log('skal fjerrens også')}
                        />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
