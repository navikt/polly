import * as React from 'react';
import Banner from '../components/Banner';
import {codelist} from "../service/Codelist";
import {Select} from 'baseui/select';
import {Block} from "baseui/block";
import {Table} from 'baseui/table';
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import UpdateCodeListModal from "../components/CodeList/ModalUpdateCodeList";
import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const CodeListPage = () => {
    const [selectedValue, setSelectedValue] = React.useState();
    const [selectedRow, setSelectedRow] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [codeListsTable, setCodeListsTable] = React.useState();
    const [updateCodeListModal, setUpdateCodeListModal] = React.useState(false);
    const headers = ['Code', 'Short Name', 'Description', ""];

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleEditCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        console.log(body);
        await axios
            .put(`${server_polly}/codelist`, body)
            .then(((response: any) => {
                console.log(response);
                console.log("Shayan codelist:");
                console.log(codelist);
                // setErrorEditPolicy(null)
                console.log(codelist.lists ? codelist.lists.codelist : "");
                console.log(codeListsTable);
                let codeListsTableTemp = codeListsTable.slice();
                let editedRowIndex = codeListsTableTemp
                    .findIndex((codeList: any) =>
                        codeList[0] === values.code
                    );

                console.log("Index=", editedRowIndex);
                codeListsTableTemp[editedRowIndex] = makeTableRow(values);
                console.log(codeListsTableTemp[editedRowIndex]);
                setCodeListsTable(codeListsTableTemp);
                setUpdateCodeListModal(false)
            }))
            .catch((error: any) => {
                setUpdateCodeListModal(true);
                console.log(error.message)
                // setErrorEditPolicy(error.message)
            });
    };

    const makeTableRow = (codeList: any) => {
        return [
            codeList.code,
            codeList.shortName,
            codeList.description,
            <Button
                size={ButtonSize.compact}
                kind={KIND.secondary}
                onClick={() => {
                    setSelectedRow(codeList);
                    setUpdateCodeListModal(true)
                }
                }
            >
                Rediger
            </Button>
        ];
    };

    return (
        <React.Fragment>
            <Banner title="Adminstrering av codelist"/>
            {loading ? null : (
                <Block>
                    <Select
                        options={codelist.makeIdLabelForAllCodeLists()}
                        onChange={({value}) => {
                            setSelectedValue(value);
                            console.log(value[0].id);
                            console.log(value);
                            console.log(codelist.lists!.codelist[value[0].id!]);
                            let codeLists = codelist
                                .lists!
                                .codelist[value[0].id!]
                                .map(codeList => makeTableRow(codeList));
                            console.log(codeLists);
                            setCodeListsTable(codeLists);
                        }}
                        placeholder="Velg codelist"
                        value={selectedValue}
                    />
                    <UpdateCodeListModal
                        title='Rediger codelist'
                        list={selectedValue ? selectedValue[0].id!.toString() : ""}
                        code={selectedRow ? selectedRow.code : ""}
                        shortName={selectedRow ? selectedRow.shortName : ""}
                        description={selectedRow ? selectedRow.description : ""}
                        isOpen={updateCodeListModal}
                        onClose={() => {
                            setUpdateCodeListModal(!updateCodeListModal)
                        }}
                        submit={handleEditCodelist}
                    />
                </Block>
            )}

            {!codeListsTable ? null :
                <Block>
                    <Table
                        columns={headers}
                        data={codeListsTable}
                    />
                </Block>
            }
        </React.Fragment>
    )
};

export default CodeListPage;