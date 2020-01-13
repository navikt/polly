import * as React from "react";
import Banner from "../components/Banner";
import { intl, useAwait } from "../util"
import { RouteComponentProps } from "react-router-dom";
import { codelist, ListName } from "../service/Codelist";
import { Spinner, Plus } from "baseui/icon";
import { Block, BlockProps } from "baseui/block";
import { getDisclosuresByRecipient, createDisclosure, deleteDisclosure, updateDisclosure } from "../api";
import TableDisclosure from "../components/common/TableDisclosure";
import { Label2, Paragraph2, H5 } from "baseui/typography";
import { Button, KIND } from "baseui/button";
import { user } from "../service/User";
import { Use, DisclosureFormValues, Disclosure } from "../constants";
import ModalThirdParty from "../components/ThirdParty/ModalThirdPartyForm";
import { getCodelistUsage } from "../api/CodelistApi";
import ListRecievedInformationTypes from "../components/ThirdParty/ListRecievedInformationTypes";

const labelBlockProps: BlockProps = {
    marginBottom: '1rem',
    font: 'font400'
}

export type PathParams = { sourceCode: string }

const ThirdPartyPage = (props: RouteComponentProps<PathParams>) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [disclosureList, setDisclosureList] = React.useState();
    const [informationTypeList, setInformationTypeList] = React.useState<Use[]>()
    const [showCreateModal, setShowCreateModal] = React.useState(false)
    const [error, setError] = React.useState();

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

    const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
        try {
            let updatedDisclosure = await updateDisclosure(disclosure)
            setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== updatedDisclosure.id), updatedDisclosure])
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }


    const handleDeleteDisclosure = async (disclosure: Disclosure) => {
        if (!disclosure) return
        try {
            await deleteDisclosure(disclosure.id)
            setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== disclosure.id)])
            setError(null)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const initialFormValues: DisclosureFormValues = {
        recipient: props.match.params.sourceCode,
        description: '',
        documentId: undefined,
        legalBases: []
    }

    useAwait(user.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await codelist.wait();
            if (props.match.params.sourceCode) {
                setDisclosureList(await getDisclosuresByRecipient(props.match.params.sourceCode))
                let responseInformationTypeList = await getCodelistUsage(ListName.THIRD_PARTY, props.match.params.sourceCode)
                setInformationTypeList(responseInformationTypeList.informationTypes)
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
                        <H5>{codelist.getShortname(ListName.THIRD_PARTY, props.match.params.sourceCode)}</H5>
                        <Paragraph2>{codelist.getDescription(ListName.THIRD_PARTY, props.match.params.sourceCode)}</Paragraph2>
                    </Block>

                    <Block display="flex" justifyContent="space-between">
                        <Label2 {...labelBlockProps}>{intl.disclosuresToThirdParty}</Label2>
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
                    <React.Fragment>
                        <Block marginBottom="3rem">
                            <TableDisclosure
                                list={disclosureList}
                                showRecipient={false}
                                errorModal={error}
                                editable
                                submitDeleteDisclosure={handleDeleteDisclosure}
                                submitEditDisclosure={handleEditDisclosure}
                                onCloseModal={() => setError(null)}
                            />
                        </Block>
                    </React.Fragment>


                    <Block marginBottom="3rem">
                        <ListRecievedInformationTypes informationtypeList={informationTypeList ? informationTypeList : []} />
                    </Block>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default ThirdPartyPage;