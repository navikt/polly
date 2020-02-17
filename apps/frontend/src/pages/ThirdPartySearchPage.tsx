import * as React from "react";
import Banner from "../components/Banner";
import { intl, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { Code, codelist, ListName } from "../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block, BlockProps } from "baseui/block";
import { StatefulSelect } from "baseui/select";
import { Disclosure, DisclosureFormValues } from "../constants";
import { createDisclosure, getAllDisclosures } from "../api";
import { user } from "../service/User";
import { useStyletron } from "styletron-react";
import { ListItem, ListItemLabel } from "baseui/list";
import RouteLink from "../components/common/RouteLink";
import { H4 } from "baseui/typography";

const rowBlockProps: BlockProps = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '3rem',
}

const ThirdPartySearchPage = (props: RouteComponentProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>()
    const [thirdPartyList, setThirdPartyList] = React.useState<Code[]>()
    const [error, setError] = React.useState();

    const [css] = useStyletron();

    const handleChangeSource = async (source?: string) => {
        if (source) {
            props.history.push(`/thirdparty/${source}`)
        }
    }

    const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
        try {
            let createdDisclosure = await createDisclosure(disclosure)
            if (!disclosureList || disclosureList.length < 1)
                setDisclosureList([createdDisclosure])
            else if (disclosureList && createdDisclosure)
                setDisclosureList([...disclosureList, createdDisclosure])

            setShowCreateModal(false)
        } catch (err) {
            setShowCreateModal(true)
            setError(err.message)
        }
    }

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            setDisclosureList(await getAllDisclosures(250, 0))
            setThirdPartyList(codelist.getCodes(ListName.THIRD_PARTY))
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            {isLoading && <Spinner />}

            {!isLoading && codelist && (
                <React.Fragment>
                    <H4>{intl.thirdParty}</H4>
                    <Block {...rowBlockProps}>
                        <StatefulSelect
                            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
                            placeholder={intl.disclosureSelect}
                            maxDropdownHeight="350px"
                            onChange={(event) => handleChangeSource((event.option ?.id) as string | undefined)}
                        />
                    </Block>
                </React.Fragment>
            )}

            {codelist && thirdPartyList && (
                <ul
                    className={css({
                        width: '375px',
                        paddingLeft: 0,
                        paddingRight: 0,
                    })}
                >
                    {thirdPartyList.map(thirdParty => (
                        <ListItem key={thirdParty.code}>
                            <ListItemLabel>
                                <RouteLink href={`thirdparty/${thirdParty.code}`}>{thirdParty.shortName}</RouteLink>
                            </ListItemLabel>
                        </ListItem>
                    ))}
                </ul>
            )}
        </React.Fragment>
    );
};

export default ThirdPartySearchPage;
