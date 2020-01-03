import * as React from "react";
import Banner from "../Banner";
import { intl, theme } from "../../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block } from "baseui/block";



interface ThirdPartyMetadataProps {
    thirdParty: any;
    expanded: string[];
    onSelectPurpose: (purpose: string) => void
}

const ThirdPartyMetadata = (props: ThirdPartyMetadataProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)


    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            <Banner title={intl.informationTypeExternalUse} />
            {isLoading && <Spinner />}

            {!isLoading && codelist && (
                <Block marginBottom="3rem">
                    Ekstern part metadata kommer her
                </Block>
            )}
        </React.Fragment>
    );
};

export default ThirdPartyMetadata;
