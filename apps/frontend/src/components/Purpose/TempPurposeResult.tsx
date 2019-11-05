import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import {
    Label1,
    Label2,
    Label3,
    Label4,
    Paragraph1,
    Paragraph2,
    Paragraph3,
    Paragraph4
} from "baseui/typography";

import TablePurpose from "./TablePurpose2";

type PurposeViewProps = {
    description: string | any | null;
    purpose:
    | {
        purpose: string | any;
        datasets: Array<any>;
    }
    | null
    | undefined;
};

const blockProps: BlockProps = {
    marginBottom: "3rem"
};

const PurposeResult = ({ description, purpose }: PurposeViewProps) => {
    return (
        <React.Fragment>
            {purpose ? (
                <React.Fragment>
                    <Block {...blockProps}>
                        <Label2 font="font400">Beskrivelse</Label2>
                        <Paragraph2>{description}</Paragraph2>
                    </Block>

                    <Block {...blockProps}>
                        <TablePurpose datasets={purpose.datasets} />
                    </Block>
                </React.Fragment>
            ) : null}
        </React.Fragment>
    );
};

export default PurposeResult;
