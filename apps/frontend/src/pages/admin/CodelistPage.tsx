import * as React from 'react'
import { useEffect } from 'react'
import { StatefulSelect } from 'baseui/select'
import { Block } from 'baseui/block'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import { useNavigate, useParams } from 'react-router-dom'

import { Code, codelist } from '../../service/Codelist'
import CreateCodeListModal from '../../components/CodeList/ModalCreateCodeList'
import { user } from '../../service/User'
import CodeListTable from '../../components/CodeList/CodeListStyledTable'
import { intl, theme, useAwait, useForceUpdate } from '../../util'
import { createCodelist } from '../../api'
import { CodeListFormValues } from '../../constants'
import { HeadingMedium } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'
import Button from '../../components/common/Button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {ampli} from "../../service/Amplitude";

const CodeListPage = () => {
  const params = useParams<{ listname?: string }>()
  const havigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [listname, setListname] = React.useState(params.listname)
  const [createCodeListModal, setCreateCodeListModal] = React.useState(false)
  const [errorOnResponse, setErrorOnResponse] = React.useState(null)
  const forceUpdate = useForceUpdate()
  useAwait(codelist.wait(), setLoading)

  ampli.logEvent("besøk", {side: 'Admin', url: '/admin/codelist/', app: 'Behandlingskatalogen', type:  'Kodeverk'})

  const lists = codelist.lists?.codelist
  const currentCodelist = lists && listname ? lists[listname] : undefined

  const handleCreateCodelist = async (values: CodeListFormValues) => {
    setLoading(true)
    try {
      await createCodelist({ ...values } as Code)
      await codelist.refreshCodeLists()
      setCreateCodeListModal(false)
    } catch (error: any) {
      setCreateCodeListModal(true)
      setErrorOnResponse(error.message)
    }
    setLoading(false)
  }

  const update = async () => {
    await codelist.refreshCodeLists()
    forceUpdate()
  }

  useEffect(() => {
    update().catch()
  }, [])

  useEffect(() => {
    if (listname && listname !== params.listname) {
      havigate(`/admin/codelist/${listname}`, { replace: true })
    }
  }, [listname, lists])

  if (!user.isAdmin() || !lists) {
    return <Spinner $size={theme.sizing.scale2400} />
  }

  return (
    <>
      <HeadingMedium>{intl.manageCodeListTitle}</HeadingMedium>
      {loading ? (
        <Spinner />
      ) : (
        <Block display="flex" justifyContent="space-between" width="100%">
          <Block width="600px">
            <StatefulSelect
              options={codelist.makeIdLabelForAllCodeLists()}
              onChange={({ value }) => setListname(value[0].id as string)}
              clearable={false}
              placeholder={intl.chooseCodeList}
              initialState={{ value: listname ? [{ id: listname, label: listname }] : [] }}
            />
          </Block>
          {listname && (
            <Block>
              <Button tooltip={intl.addNew} icon={faPlus} size={ButtonSize.compact} kind={KIND.tertiary} onClick={() => setCreateCodeListModal(!createCodeListModal)}>
                {intl.createNewCodeList}
              </Button>
            </Block>
          )}
        </Block>
      )}

      {!loading && currentCodelist && (
        <Block marginTop={theme.sizing.scale600}>
          <CodeListTable tableData={currentCodelist || []} refresh={update} />
        </Block>
      )}

      <CreateCodeListModal
        title={intl.createCodeListTitle}
        list={listname!}
        isOpen={createCodeListModal}
        errorOnCreate={errorOnResponse}
        onClose={() => {
          setCreateCodeListModal(!createCodeListModal)
          setErrorOnResponse(null)
        }}
        submit={handleCreateCodelist}
      />
    </>
  )
}

export default CodeListPage
