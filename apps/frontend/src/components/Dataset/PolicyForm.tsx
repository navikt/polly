import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Input, SIZE as ButtonSIZE } from "baseui/input";
import { Select, Value } from "baseui/select";

type PolicyProps = {
    onAddSubmit: Function;
    selectItems: { id: any }[] | undefined;
};

const inputBlockProps: BlockProps = {
    width: "100%",
    marginRight: "2rem"
};

const rowBlockProps: BlockProps = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3rem"
};

const PolicyForm = ({ onAddSubmit, selectItems }: PolicyProps) => {
    const [purposeValue, setPurposeValue] = React.useState<Value>([]);
    const [legalBasisValue, setLegalBasisValue] = React.useState("");

    return (
        <React.Fragment>
            <hr />
            <Block marginBottom="1rem" marginTop="2rem">
                <h2>Behandlingsgrunnlag</h2>
            </Block>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    onAddSubmit({
                        purposeCode:
                            purposeValue.length > 0 ? purposeValue[0].id : "",
                        legalBasisDescription: legalBasisValue
                    });
                }}
            >
                <Block {...rowBlockProps}>
                    <Block {...inputBlockProps}>
                        <Select
                            options={selectItems}
                            labelKey="id"
                            valueKey="id"
                            maxDropdownHeight="150px"
                            onChange={({ value }) => {
                                setPurposeValue(value);
                            }}
                            value={purposeValue}
                        />
                    </Block>

                    <Block {...inputBlockProps}>
                        <Input
                            type="text"
                            placeholder="Skriv inn rettslig grunnlag"
                            value={legalBasisValue}
                            onChange={event =>
                                setLegalBasisValue(event.currentTarget.value)
                            }
                        />
                    </Block>
                    <Button
                        type="submit"
                        size={SIZE.compact}
                        overrides={{
                            BaseButton: {
                                style: ({ $theme }) => {
                                    return {
                                        paddingRight: "3rem",
                                        paddingLeft: "3rem"
                                    };
                                }
                            }
                        }}
                    >
                        Lagre
                    </Button>
                </Block>
            </form>
        </React.Fragment>
    );
};

export default PolicyForm;
