import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Label2 } from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import { InformationType, Policy } from "../../../constants"
import { intl } from "../../../util"
import Metadata from "./Metadata";
import { PurposeMap } from "../../../pages/InformationtypePage"
import TableInformationtype from "./TableInformationtype"
import { Button } from "baseui/button"

const purposeBlockProps: BlockProps = {
    marginTop: '3rem'
}

interface InformationtypeMetadataProps {
    informationtype: InformationType;
    policies: Policy[];
    expanded: string[];
    onSelectPurpose: (purpose: string) => void
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
    const {informationtype, policies, expanded, onSelectPurpose} = props
    const [accordion, setAccordion] = React.useState(false);

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    <Metadata informationtype={informationtype}/>

                    <Block {...purposeBlockProps}>
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
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
