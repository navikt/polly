import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Select, Value, TYPE } from "baseui/select";

import FormPurpose from "./FormPurpose";
import TablePurpose from "./TablePurpose";

type PurposeViewProps = {
    optionsSelect: any | undefined;
};

const PurposeView = ({ optionsSelect }: PurposeViewProps) => {
    const [value, setValue] = React.useState<Value>([]);
    console.log(optionsSelect, "OPTIOS");

    return (
        <React.Fragment>
            <h1>Formål</h1>
            <Block marginTop="2rem">
                <Select
                    options={optionsSelect}
                    labelKey="id"
                    valueKey="id"
                    placeholder="Velg formål"
                    onChange={({ value }) => setValue(value)}
                    value={value}
                />
            </Block>

            <Block marginTop="3rem" width="100%">
                <TablePurpose />
            </Block>
        </React.Fragment>
    );
};

export default PurposeView;
