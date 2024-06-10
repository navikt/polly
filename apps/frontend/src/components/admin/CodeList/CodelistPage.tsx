import * as React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Code, codelist } from '../../../service/Codelist'
import CreateCodeListModal from './ModalCreateCodeList'
import { user } from '../../../service/User'
import CodeListTable from './CodeListStyledTable'
import { useAwait, useForceUpdate } from '../../../util'
import { createCodelist } from '../../../api'
import { CodeListFormValues } from '../../../constants'
import {ampli} from "../../../service/Amplitude";
import {Button, Heading, Loader, Select} from "@navikt/ds-react";
import {PlusIcon} from "@navikt/aksel-icons";

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
    if (listname && listname !== params.listname) {
      havigate(`/admin/codelist/${listname}`, { replace: true })
    }
  }, [listname, lists])

  if (!user.isAdmin() || !lists) {
    return <Loader size="2xlarge" />
  }

  return (
    <>
      <Heading size="large" level="1">Administrering av kodeverk</Heading>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-between w-full" >
            <Select label="Velg kodeverk"
                    hideLabel
                    onChange={(event) => setListname(event.target.value as string)}
            >
              <option value="">Velg kodeverk</option>
              {codelist.makeIdLabelForAllCodeLists().map((value)=> {
                return (
                  <>
                    <option key={value.id} value={value.id}>{value.label}</option>
                  </>
                )
              })}
            </Select>
          {listname && (
            <div>
              <Button icon={<PlusIcon />}  onClick={() => setCreateCodeListModal(!createCodeListModal)}>
                Opprett ny kode
              </Button>
            </div>
          )}
        </div>
      )}

      {!loading && currentCodelist && (
        <div className="mt-4" >
          <CodeListTable tableData={currentCodelist || []} refresh={update} />
        </div>
      )}

      <CreateCodeListModal
        title="Ny kode"
        list={listname!}
        isOpen={createCodeListModal}
        errorOnCreate={errorOnResponse}
        onClose={() => {
          setCreateCodeListModal(false)
          setErrorOnResponse(null)
        }}
        submit={handleCreateCodelist}
      />
    </>
  )
}

export default CodeListPage
