import * as React from "react";
import { styled } from "baseui";
import { Select, TYPE, Value } from "baseui/select";
import { Label1, Label2 } from "baseui/typography";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { BlockProps, Block } from "baseui/block";
import { Input, SIZE } from "baseui/input";
import { StatefulSelect } from "baseui/select";
import { Radio, RadioGroup } from "baseui/radio";
import { StatefulTextarea } from "baseui/textarea";
import { Button } from "baseui/button";

const Centered = styled("div", {
    height: "100%",
    margin: "0 auto",
    width: "80%",
    paddingBottom: "10rem"
});

const labelProps: BlockProps = {
    marginRight: "8px",
    width: "20%",
    alignSelf: "center"
};

const FormCreateInformationType = () => {
    const [value, setValue] = React.useState("2");

    return (
        <React.Fragment>
            <FlexGrid
                flexGridColumnCount={2}
                flexGridColumnGap="scale800"
                flexGridRowGap="scale1000"
            >
                <FlexGridItem>
                    <Block width="100">
                        <Block {...labelProps}>
                            <Label2>Begrep</Label2>
                        </Block>

                        <Block>
                            <StatefulSelect
                                options={[
                                    { id: "AliceBlue", color: "#F0F8FF" },
                                    {
                                        id: "AntiqueWhite",
                                        color: "#FAEBD7"
                                    },
                                    { id: "Aqua", color: "#00FFFF" },
                                    { id: "Aquamarine", color: "#7FFFD4" },
                                    { id: "Azure", color: "#F0FFFF" },
                                    { id: "Beige", color: "#F5F5DC" }
                                ]}
                                placeholder="Skriv inn og velg begrep"
                                labelKey="id"
                                valueKey="color"
                                onChange={event => console.log(event)}
                            />
                        </Block>
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Personopplysning</Label2>
                    </Block>

                    <Block>
                        <RadioGroup value={value} align="horizontal">
                            <Radio value="1">Ja</Radio>
                            <Block marginLeft="1rem"></Block>
                            <Radio value="2">Nei</Radio>
                        </RadioGroup>
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Navn</Label2>
                    </Block>

                    <Block>
                        <Input placeholder="Skriv inn navn" />
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Kontekst</Label2>
                    </Block>

                    <Block>
                        <Input placeholder="Skriv inn kontekt" />
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Sensitivt</Label2>
                    </Block>

                    <Block>
                        <Input placeholder="Skriv inn kontekt" />
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Kategori</Label2>
                    </Block>

                    <Block>
                        <StatefulSelect
                            options={[
                                { id: "AliceBlue", color: "#F0F8FF" },
                                {
                                    id: "AntiqueWhite",
                                    color: "#FAEBD7"
                                },
                                { id: "Aqua", color: "#00FFFF" },
                                { id: "Aquamarine", color: "#7FFFD4" },
                                { id: "Azure", color: "#F0FFFF" },
                                { id: "Beige", color: "#F5F5DC" }
                            ]}
                            placeholder="Velg kategorier"
                            labelKey="id"
                            valueKey="color"
                            onChange={event => console.log(event)}
                        />
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Beskrivelse</Label2>
                    </Block>

                    <Block>
                        <StatefulTextarea
                            onChange={console.log}
                            placeholder="Skriv inn beskrivelse av opplysningtypen"
                            rows={5}
                        />
                    </Block>
                </FlexGridItem>

                <FlexGridItem>
                    <Block {...labelProps}>
                        <Label2>Nøkkelord</Label2>
                    </Block>

                    <Block>
                        <Input placeholder="Skriv inn nøkkelord" />
                    </Block>
                </FlexGridItem>
            </FlexGrid>

            <Block display="flex" marginTop="2rem">
                <Button
                    type="submit"
                    overrides={{
                        BaseButton: {
                            style: ({ $theme }) => {
                                return {
                                    alignContent: "center",
                                    paddingRight: "4rem",
                                    paddingLeft: "4rem"
                                };
                            }
                        }
                    }}
                >
                    Lagre
                </Button>
            </Block>
        </React.Fragment>
    );
};

export default FormCreateInformationType;
