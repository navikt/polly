import * as React from "react";
import { Block, BlockProps } from 'baseui/block'
import { Label2 } from "baseui/typography";

import AccordionInformationtype from './AccordionInformationtype'
import { InformationType } from "../../../constants"
import { intl } from "../../../util"
import Metadata from "./Metadata";
import { PurposeMap } from "../../../pages/InformationtypePage"

const purposeBlockProps: BlockProps = {
    marginTop: '3rem'
}

interface InformationtypeMetadataProps {
    informationtype: InformationType;
    purposeMap: PurposeMap;
    expanded: string[];
    onSelectPurpose: (purpose: string) => void
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
    const { informationtype, purposeMap, expanded, onSelectPurpose } = props

    return (
        <React.Fragment>
            {informationtype && (
                <React.Fragment>
                    <Metadata informationtype={informationtype} />

                    <Block {...purposeBlockProps}>
                        <Label2 marginBottom="2rem" font="font450">{intl.purposeUse}</Label2>
                        <AccordionInformationtype purposeMap={purposeMap} expaneded={expanded}
                            onChange={args => args.expanded.length && onSelectPurpose(args.expanded[0] as string)} />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default InformationtypeMetadata;
