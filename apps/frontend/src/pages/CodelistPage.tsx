import * as React from "react"
import { useEffect } from "react"
import { StatefulSelect } from "baseui/select"
import { Block } from "baseui/block"
import { Button, KIND, SIZE as ButtonSize } from "baseui/button"
import { RouteComponentProps, withRouter } from "react-router-dom"
import axios from "axios"
import { Plus } from "baseui/icon"

import Banner from "../components/Banner"
import { Code, codelist } from "../service/Codelist"
import CreateCodeListModal from "../components/CodeList/ModalCreateCodeList"
import { user } from "../service/User"
import CodeListTable from "../components/CodeList/CodeListStyledTable"
import { intl } from "../util"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT

const CodeListPage = (props: RouteComponentProps<{ listname?: string }>) => {
    const [loading, setLoading] = React.useState(true)
    const [listname, setListname] = React.useState(props.match.params.listname)
    const [createCodeListModal, setCreateCodeListModal] = React.useState(false)
    const [errorOnResponse, setErrorOnResponse] = React.useState(null)

    const hasAccess = () => user.isAdmin()
    const lists = codelist.lists?.codelist
    const currentCodelist = lists && listname ? lists[listname] : undefined

    useEffect(() => {
        (async () => {
            setLoading(true)
            await codelist.wait()
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        if (listname && listname !== props.match.params.listname) {
            props.history.replace(`/admin/codelist/${listname}`)
        }
    }, [listname, lists])

    const handleCreateCodelist = async (values: Code) => {
        let body = [{
            ...values,
        }]
        setLoading(true)
        await axios
        .post<Code[]>(`${server_polly}/codelist`, body)
        .then(((response) => {
            codelist.refreshCodeLists()
            setCreateCodeListModal(false)
        }))
        .catch((error: any) => {
            setCreateCodeListModal(true)
            setErrorOnResponse(error.message)
        })
        setLoading(false)
    }

    return <>
        <Banner title={intl.manageCodeListTitle}/>
        {loading ? null : (
            <Block>
                <StatefulSelect
                    options={codelist.makeIdLabelForAllCodeLists()}
                    onChange={({value}) => setListname(value[0].id as string)}
                    clearable={false}
                    placeholder={intl.chooseCodeList}
                    initialState={{value: listname ? [{id: listname, label: listname}] : []}}
                />
            </Block>
        )}

        {currentCodelist && !loading &&
        <>
            {hasAccess() && (
                <Block display="flex" justifyContent="flex-end">
                    <Button
                        $style={{
                            marginTop: "16px",
                            marginBottom: "16px",
                        }}
                        size={ButtonSize.compact}
                        kind={KIND.minimal}
                        onClick={() => setCreateCodeListModal(!createCodeListModal)}
                        startEnhancer={
                            () =>
                                <Block
                                    display="flex"
                                    justifyContent="center">
                                    <Plus size={22}/>
                                </Block>}
                    >
                        {intl.createNewCodeList}
                    </Button>
                    <CreateCodeListModal
                        title={intl.createCodeListTitle}
                        list={listname!}
                        isOpen={createCodeListModal}
                        errorOnCreate={errorOnResponse}
                        onClose={
                            () => {
                                setCreateCodeListModal(!createCodeListModal)
                                setErrorOnResponse(null)
                            }
                        }
                        submit={handleCreateCodelist}
                    />
                </Block>
            )}
          <Block>
            <CodeListTable
                tableData={currentCodelist}
                hasAccess={hasAccess()}
            />
          </Block>
        </>
        }
    </>
}

export default withRouter(CodeListPage)