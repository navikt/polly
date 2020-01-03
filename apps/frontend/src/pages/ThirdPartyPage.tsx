import * as React from "react";
import Banner from "../components/Banner";
import { intl, theme } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block } from "baseui/block";
import { getDisclosuresByRecipient } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";
import { Label2, H2, H3 } from "baseui/typography";

export type PathParams = { sourceCode?: string }

const ThirdPartyPage = (props: RouteComponentProps<PathParams>) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [thirdParty, setThirdParty] = React.useState();


    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            if (props.match.params.sourceCode) {
                console.log(await getDisclosuresByRecipient(props.match.params.sourceCode), "SOURCECODE")
                setThirdParty(await getDisclosuresByRecipient(props.match.params.sourceCode))
            }

            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Banner title={intl.thirdParty} />
            {isLoading && <Spinner />}

            {!isLoading && codelist && (
                <React.Fragment>
                    <Block marginBottom="3rem">
                        <H3>Fra Mugge sjæl</H3>
                        Kommer metadata om den eksterne parten her...
                    </Block>
                    {thirdParty && thirdParty.length > 0 && (
                        <React.Fragment>
                            <Block marginBottom="3rem">
                                <Label2 marginBottom="2rem" font="font450">Utleveringer</Label2>
                                <TableDisclosure list={thirdParty} showRecipient={false} />
                            </Block>
                            <Block marginBottom="3rem">
                                <Label2 marginBottom="2rem" font="font450">Innhentinger</Label2>
                                {/* <TableDisclosure list={thirdParty} showRecipient={false} /> */}
                            </Block>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default ThirdPartyPage;