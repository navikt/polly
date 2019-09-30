import * as React from "react";
import { Block, BlockProps } from "baseui/block";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Select, Value, TYPE } from "baseui/select";

const rowBlockProps: BlockProps = {
    display: "flex",
    marginBottom: "3rem",
    marginTop: '3rem',
    width: '100%'
};

const FormPurpose = () => {
    const [value, setValue] = React.useState<Value>([]);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                console.log('clicked')
            }}
        >
            <Block {...rowBlockProps}>
                <Block width="100%">
                    <Select
                        options={[
                            { id: 'AliceBlue', color: '#F0F8FF' },
                            { id: 'AntiqueWhite', color: '#FAEBD7' },
                            { id: 'Aqua', color: '#00FFFF' },
                            { id: 'Aquamarine', color: '#7FFFD4' },
                            { id: 'Azure', color: '#F0FFFF' },
                            { id: 'Beige', color: '#F5F5DC' },
                        ]}
                        labelKey="id"
                        valueKey="color"
                        placeholder="Velg formål"
                        onChange={({ value }) => setValue(value)}
                        value={value}
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
                    Søk
                </Button>
            </Block>
        </form>
    );
};

export default FormPurpose;
