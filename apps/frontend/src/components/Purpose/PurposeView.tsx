import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Select, Value, TYPE } from "baseui/select";

import FormPurpose from "./FormPurpose";
import TablePurpose from "./TablePurpose";

type PurposeViewProps = {
    purpose: any | null | undefined;
    handleChange: Function;
    optionsSelect: any | undefined;
};

const PurposeView = ({
    purpose,
    handleChange,
    optionsSelect
}: PurposeViewProps) => {
    const [value, setValue] = React.useState<Value>([]);

    return (
        <React.Fragment>
            <h1>Formål</h1>
            <Block marginTop="2rem">
                <Select
                    options={optionsSelect}
                    labelKey="id"
                    valueKey="id"
                    placeholder="Velg formål"
                    maxDropdownHeight="250px"
                    onChange={({ value }) => {
                        setValue(value);
                        handleChange(
                            value && value.length > 0 ? value[0].id : null
                        );
                    }}
                    value={value}
                />
            </Block>

            {purpose ? (
                <React.Fragment>
                    <Block marginTop="3rem" marginBottom="3rem">
                        <TablePurpose datasets={purpose.datasets} />
                    </Block>
                </React.Fragment>
            ) : null}
        </React.Fragment>
    );
};

export default PurposeView;
