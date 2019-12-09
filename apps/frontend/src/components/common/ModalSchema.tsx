import {ErrorMessage} from "formik";
import {Block} from "baseui/block";
import {KIND as NKIND, Notification} from "baseui/notification";
import {Label2} from "baseui/typography";
import * as React from "react";

export const Error = (props: { fieldName: string }) => (
    <ErrorMessage name={props.fieldName}>
        {msg => (
            <Block display="flex" width="100%" marginTop=".2rem">
                {renderLabel('')}
                <Block width="100%">
                    <Notification overrides={{ Body: { style: { width: 'auto', padding: 0, marginTop: 0 } } }} kind={NKIND.negative}>{msg}</Notification>
                </Block>
            </Block>
        )}
    </ErrorMessage>
);

export const renderLabel = (label: any | string) => (
    <Block width="25%" alignSelf="center">
        <Label2 marginBottom="8px" font="font300">{label.toString()}</Label2>
    </Block>
);