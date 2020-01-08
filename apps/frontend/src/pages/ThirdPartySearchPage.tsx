import * as React from "react";
import Banner from "../components/Banner";
import { intl, theme, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block, BlockProps } from "baseui/block";
import { StatefulSelect } from "baseui/select";
import { Disclosure, DisclosureFormValues } from "../constants";
import { getAllDisclosures, createDisclosure } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";
import { Button } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { user } from "../service/User";
import ModalThirdParty from "../components/ThirdParty/ModalThirdParty";

const rowBlockProps: BlockProps = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '3rem',
}

const initialFormValues: DisclosureFormValues = {
    recipient: '',
    description: '',
    informationTypes: [],
    legalBases: []
}

const ThirdPartySearchPage = (props: RouteComponentProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>()
    const [error, setError] = React.useState(null);

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
                    <Block {...rowBlockProps}>
                        <Block width="80%">
                        <StatefulSelect
                            options={codelist.getParsedOptions(ListName.SOURCE)}
                            placeholder={intl.disclosureSelect}
                            maxDropdownHeight="350px"
                            onChange={(event) => handleChangeSource((event.option?.id) as string | undefined)}
                        />
                        </Block>
                        <Block>
                            {user.canWrite() &&
                            <Button type="button" onClick={() => setShowCreateModal(true)}>
                              <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createNew}
                            </Button>
                            }
                            <ModalThirdParty
                                title={intl.createThirdPartyModalTitle}
                                isOpen={showCreateModal}
                                isEdit={false}
                                initialValues={initialFormValues}
                                submit={handleCreateDisclosure}
                                onClose={() =>{ 
                                    setShowCreateModal(false)
                                    setError(null)
                                }}
                                errorOnCreate={error}
                            />
                        </Block>
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
