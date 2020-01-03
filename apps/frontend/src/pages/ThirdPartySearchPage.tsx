import * as React from "react";
import Banner from "../components/Banner";
import { intl, theme } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block } from "baseui/block";
import { StatefulSelect } from "baseui/select";
import { generatePath } from "react-router";
import { Disclosure } from "../constants";
import { getAllDisclosures } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";


const ThirdPartySearchPage = (props: RouteComponentProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>()
    const [error, setError] = React.useState(null);

    const handleChangeSource = async (source?: string) => {
        if (source) {
            props.history.push(`/thirdparty/${source}`)
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            setDisclosureList(await getAllDisclosures())
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Banner title={intl.disclosure} />
            {isLoading && <Spinner />}

            {!isLoading && codelist && (
                <React.Fragment>
                    {/* {currentSource && (
                         <ThirdPartyMetadata />
                    )} */}

                    <Block marginBottom="3rem">
                        <StatefulSelect
                            options={codelist.getParsedOptions(ListName.SOURCE)}
                            placeholder={intl.disclosureSelect}
                            maxDropdownHeight="350px"
                            onChange={(event) => handleChangeSource((event.option?.id) as string | undefined)}
                        />
                    </Block>
                </React.Fragment>

            )}

            {codelist && disclosureList && (
                <TableDisclosure list={disclosureList} showRecipient/>
            )}
        </React.Fragment>
    );
};

export default ThirdPartySearchPage;
