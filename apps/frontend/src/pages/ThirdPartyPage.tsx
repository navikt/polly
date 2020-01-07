import * as React from "react";
import Banner from "../components/Banner";
import { intl, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Spinner, Plus } from "baseui/icon";
import { Block, BlockProps } from "baseui/block";
import { getDisclosuresByRecipient, createDisclosure } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";
import { Label2, Paragraph2, H5 } from "baseui/typography";
import { Button, SIZE, KIND } from "baseui/button";
import { user } from "../service/User";
import { DisclosureFormValues } from "../constants";
import ModalThirdParty from "../components/ThirdParty/ModalThirdParty";

const labelBlockProps: BlockProps = {
    marginBottom: '2rem',
    font: 'font450'
}

export type PathParams = { sourceCode: string }

const ThirdPartyPage = (props: RouteComponentProps<PathParams>) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [disclosureList, setDisclosureList] = React.useState();
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [error, setError] = React.useState(null);

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

    const initialFormValues: DisclosureFormValues = {
        recipient: props.match.params.sourceCode,
        description: '',
        informationTypes: [],
        legalBases: []
    }

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            if (props.match.params.sourceCode) {
                setDisclosureList(await getDisclosuresByRecipient(props.match.params.sourceCode))
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
                        <H5>{codelist.getShortname(ListName.SOURCE, props.match.params.sourceCode)}</H5>
                        <Paragraph2>{codelist.getDescription(ListName.SOURCE, props.match.params.sourceCode)}</Paragraph2>
                    </Block>
                    {disclosureList && disclosureList.length > 0 && (
                        <React.Fragment>
                            <Block marginBottom="3rem">
                                <Block display="flex" justifyContent="space-between">
                                    <Label2 {...labelBlockProps}>Utleveringer</Label2>
                                    {user.canWrite() &&
                                        <Block>
                                            <Button
                                                size="compact"
                                                kind={KIND.minimal}
                                                onClick={() => setShowCreateModal(true)}
                                                startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                            >
                                                {intl.createNew}
                                            </Button>
                                            <ModalThirdParty
                                                title={intl.createThirdPartyModalTitle}
                                                isOpen={showCreateModal}
                                                isEdit={false}
                                                initialValues={initialFormValues}
                                                submit={handleCreateDisclosure}
                                                onClose={() => {
                                                    setShowCreateModal(false)
                                                    setError(null)
                                                }}
                                                errorOnCreate={error}
                                                disableRecipientField={true}
                                            />
                                        </Block>
                                    }
                                </Block>

                                <TableDisclosure list={disclosureList} showRecipient={false} />
                            </Block>
                            <Block marginBottom="3rem">
                                <Label2 {...labelBlockProps}>Innhentinger</Label2>
                            </Block>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default ThirdPartyPage;