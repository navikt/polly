import * as React from "react";
import Banner from "../../components/Banner";
import { styled } from 'baseui';
import { Select, TYPE, Value } from "baseui/select";
import { Label1, Label2 } from "baseui/typography";
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { BlockProps, Block } from 'baseui/block';
import { Input, SIZE } from "baseui/input";
import { StatefulSelect } from 'baseui/select';
import { Radio, RadioGroup } from "baseui/radio";
import { StatefulTextarea } from 'baseui/textarea';
import { Button } from "baseui/button";


const Centered = styled('div', {
    height: '100%',
    margin: '0 auto',
    width: '60%',
    paddingBottom: '10rem'
});

const labelProps: BlockProps = {
    marginRight: "8px",
    width: '20%',
    alignSelf: 'center',
};

const fieldProps: BlockProps = {
    width: '70%'
};

const TempCreatePage = () => {
    const [value, setValue] = React.useState("2");

    return (
        <React.Fragment>
            <Banner title="Opprett ny opplysningstype" />
            <Centered>
                <FlexGrid
                    flexGridColumnCount={1}
                    flexGridColumnGap="scale800"
                    flexGridRowGap="scale800"
                >
                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Begrep</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <StatefulSelect
                                    options={[
                                        { id: 'AliceBlue', color: '#F0F8FF' },
                                        { id: 'AntiqueWhite', color: '#FAEBD7' },
                                        { id: 'Aqua', color: '#00FFFF' },
                                        { id: 'Aquamarine', color: '#7FFFD4' },
                                        { id: 'Azure', color: '#F0FFFF' },
                                        { id: 'Beige', color: '#F5F5DC' },
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
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Navn</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <Input placeholder="Skriv inn navn" />
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Kontekst</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <Input placeholder="Skriv inn kontekt" />
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Personopplysning</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <RadioGroup
                                    value={value}
                                    align='horizontal'
                                >
                                    <Radio value="1">Ja</Radio>
                                    <Block marginLeft="1rem"></Block>
                                    <Radio value="2">Nei</Radio>
                                </RadioGroup>
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Sensitivt</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <RadioGroup
                                    value={value}
                                    align='horizontal'
                                >
                                    <Radio value="1">Ja</Radio>
                                    <Block marginLeft="1rem"></Block>
                                    <Radio value="2">Nei</Radio>
                                </RadioGroup>
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Kategori</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <StatefulSelect
                                    options={[
                                        { id: 'AliceBlue', color: '#F0F8FF' },
                                        { id: 'AntiqueWhite', color: '#FAEBD7' },
                                        { id: 'Aqua', color: '#00FFFF' },
                                        { id: 'Aquamarine', color: '#7FFFD4' },
                                        { id: 'Azure', color: '#F0FFFF' },
                                        { id: 'Beige', color: '#F5F5DC' },
                                    ]}
                                    placeholder="Velg kategorier"
                                    labelKey="id"
                                    valueKey="color"
                                    onChange={event => console.log(event)}
                                />
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Nøkkelord</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <Input placeholder="Skriv inn nøkkelord" />
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem>
                        <Block display="flex" width="100">
                            <Block  {...labelProps}>
                                <Label2>Beskrivelse</Label2>
                            </Block>

                            <Block {...fieldProps}>
                                <StatefulTextarea
                                    onChange={console.log}
                                    placeholder="Skriv inn beskrivelse av opplysningtypen"
                                    rows={5}
                                />
                            </Block>
                        </Block>
                    </FlexGridItem>

                    <FlexGridItem marginTop="1rem">
                        <Block display="flex" width="100%" justifyContent="center">
                            <Button
                                type="submit"
                                overrides={{
                                    BaseButton: {
                                        style: ({ $theme }) => {
                                            return {
                                                alignContent: "center",
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
                    </FlexGridItem>
                </FlexGrid>
            </Centered>

        </React.Fragment>
    );
};

export default TempCreatePage;