import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";

import FormPurpose from './FormPurpose'

const PurposeView = () => {

    return (
        <React.Fragment>
            <FormPurpose />
        </React.Fragment>
    );
};

export default PurposeView;
