import * as React from 'react'
import { useEffect } from 'react'
import { StatefulSelect } from 'baseui/select'
import { Block } from 'baseui/block'
import { KIND, SIZE as ButtonSize } from 'baseui/button'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Code, codelist } from '../../service/Codelist'
import CreateCodeListModal from '../../components/CodeList/ModalCreateCodeList'
import { user } from '../../service/User'
import CodeListTable from '../../components/CodeList/CodeListStyledTable'
import { intl, theme, useAwait, useForceUpdate } from '../../util'
import { createCodelist } from '../../api'
import { CodeListFormValues } from '../../constants'
import { H4 } from 'baseui/typography'
import { StyledSpinnerNext } from 'baseui/spinner'
import Button from '../../components/common/Button'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const CodeListPage = (props: RouteComponentProps<{ listname?: string }>) => {
  const [loading, setLoading] = React.useState(true)
  const [listname, setListname] = React.useState(props.match.params.listname)
  const [createCodeListModal, setCreateCodeListModal] = React.useState(false)
  const [errorOnResponse, setErrorOnResponse] = React.useState(null)
  const forceUpdate = useForceUpdate()
  useAwait(codelist.wait(), setLoading)
  useAwait(user.wait())

  const lists = codelist.lists?.codelist
  const currentCodelist = lists && listname ? lists[listname] : undefined

  useEffect(() => {
    if (listname && listname !== props.match.params.listname) {
      props.history.replace(`/admin/codelist/${listname}`)
    }
  }, [listname, lists])

  if (!user.isAdmin() || !lists) {
    return <StyledSpinnerNext size={theme.sizing.scale2400}/>
  }

  const handleCreateCodelist = async (values: CodeListFormValues) => {
    setLoading(true)
    try {
      await createCodelist({...values} as Code)
      await codelist.refreshCodeLists()
      setCreateCodeListModal(false)
    } catch (error) {
      setCreateCodeListModal(true)
      setErrorOnResponse(error.message)
    }
    setLoading(false)
  }
  const update = async () => {
    await codelist.refreshCodeLists()
    forceUpdate()
  }

  return <>
    <H4>{intl.manageCodeListTitle}</H4>
    {loading ? <StyledSpinnerNext/> : (
      <Block display='flex' justifyContent='space-between' width='100%'>
        <Block width='600px'>
          <StatefulSelect
            options={codelist.makeIdLabelForAllCodeLists()}
            onChange={({value}) => setListname(value[0].id as string)}
            clearable={false}
            placeholder={intl.chooseCodeList}
            initialState={{value: listname ? [{id: listname, label: listname}] : []}}
          />
        </Block>
        <Block>
          <Button
            tooltip={intl.addNew}
            icon={faPlus}
            size={ButtonSize.compact}
            kind={KIND.minimal}
            onClick={() => setCreateCodeListModal(!createCodeListModal)}
          >
            {intl.createNewCodeList}
          </Button>
        </Block>
      </Block>
    )}

    {!loading && currentCodelist &&
    <Block marginTop={theme.sizing.scale600}>
      <CodeListTable
        tableData={currentCodelist || []}
        refresh={update}
      />
    </Block>
    }

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
  </>
}

export default withRouter(CodeListPage)
