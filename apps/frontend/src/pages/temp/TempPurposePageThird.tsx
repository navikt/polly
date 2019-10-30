import * as React from "react";
import { Block } from "baseui/block";
import Banner from "../../components/Banner";
import { StatefulSelect } from 'baseui/select';
import { Accordion, Panel } from 'baseui/accordion';
import {
    Label2,
    Paragraph2,
} from "baseui/typography";

import TablePurpose from '../../components/Temp/TablePurpose'
import purposeMock from '../../mock/purposeMock'
import processV1 from '../../mock/processV1'

const TempPurposePageThird = () => {
    const [showResult, setShowResult] = React.useState(false);
    const [currentPurpose, setCurrentPurpose] = React.useState()

    const handleChangePurpose = (purpose: any) => {
        if (!purpose) {
            setShowResult(false)
            setCurrentPurpose(null)
            return 
        }

        if (purpose === "Statistikk")
            setCurrentPurpose(processV1.Statistikk)
        else if (purpose === "Foreldrepenger")
            setCurrentPurpose(processV1.Foreldrepenger)

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
                        <Accordion >
                            {currentPurpose.behandlinger.map((behandling: any) => (
                                <Panel title={behandling.title} key={behandling.title}>
                                    <TablePurpose datasets={behandling.policies}/>
                                </Panel>
                            ))}
                        </Accordion>
                    </Block>
                </React.Fragment>
            ) : null}


        </React.Fragment>
    );
};

export default TempPurposePageThird;
