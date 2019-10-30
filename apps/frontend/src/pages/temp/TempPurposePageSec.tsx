import * as React from "react";
import { Block } from "baseui/block";
import Banner from "../../components/Banner";
import { StatefulSelect } from 'baseui/select';
import { Accordion, Panel } from 'baseui/accordion';
import { ChevronRight, Search } from 'baseui/icon';
import { Label2, Paragraph2 } from "baseui/typography";
import { ListItem, ListItemLabel, ARTWORK_SIZES } from 'baseui/list';

import purposeMock from '../../mock/purposeMock'
import processV2 from '../../mock/processV2'

const TempPurposePageSec = () => {
    const [showResult, setShowResult] = React.useState(false);
    const [currentPurpose, setCurrentPurpose] = React.useState()

    const handleChangePurpose = (purpose: any) => {
        if (!purpose) {
            setShowResult(false)
            setCurrentPurpose(null)
            return
        }

        if (purpose === "Statistikk")
            setCurrentPurpose(processV2.Statistikk)
        else if (purpose === "Foreldrepenger")
            setCurrentPurpose(processV2.Foreldrepenger)

        setShowResult(true)
    }

    return (
        <React.Fragment>
            <Banner title="Formål" />

            <Block>
                <StatefulSelect
                    options={purposeMock}
                    labelKey="id"
                    valueKey="id"
                    onChange={(event) => handleChangePurpose(event.option ? event.option.id : null)}
                />
            </Block>

            {showResult && currentPurpose ? (
                <React.Fragment>
                    <Block marginTop="3rem">
                        <Label2 font="font400">Beskrivelse</Label2>
                        <Paragraph2>{currentPurpose.description}</Paragraph2>
                    </Block>

                    <Block marginTop="3rem">
                        
                        <Accordion>
                            {currentPurpose.behandlinger.map((behandling: any) => (
                                <Panel title={behandling.title} key={behandling.title}>
                                    <Block display="flex" marginBottom="2rem">
                                        <Block marginRight="6rem">
                                            <Label2>Rettslig grunnlag</Label2>
                                            <Block>
                                                {behandling.rettsligGrunnlag.map((rg: any) => (
                                                    <React.Fragment>
                                                        <Paragraph2>{rg}</Paragraph2>
                                                    </React.Fragment>
                                                ))}
                                            </Block>
                                        </Block>
                                        <Block>
                                            <Label2>Kategorier av personer</Label2>
                                            <Paragraph2>{behandling.personkategorier}</Paragraph2>
                                        </Block>
                                    </Block>

                                    <Block width="400px">
                                        <Label2 marginBottom="1rem">Opplysningstyper</Label2>

                                        {behandling.opplysningstyper ? (
                                            <React.Fragment>
                                                {behandling.opplysningstyper.length > 0 ?
                                                    behandling.opplysningstyper.map((ot: any) => (
                                                        <ListItem sublist>
                                                            <ListItem
                                                                endEnhancer={() => <ChevronRight />}
                                                                sublist
                                                            >
                                                                <ListItemLabel sublist>{ot.opplysningstypeTitle}</ListItemLabel>
                                                            </ListItem>
                                                        </ListItem>
                                                    )
                                                    ) : null}
                                            </React.Fragment>
                                        ) : null}

                                    </Block>
                                </Panel>
                            ))}
                        </Accordion>

                    </Block>
                </React.Fragment>
            ) : null}


        </React.Fragment>
    );
};

export default TempPurposePageSec;
