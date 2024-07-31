import { PlusIcon } from '@navikt/aksel-icons'
import { Button, Heading, Loader, Select } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { createCodelist } from '../../../api'
import { CodeListFormValues } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { Code, codelist, List } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { useAwait, useForceUpdate } from '../../../util'
import CodeListTable from './CodeListStyledTable'
import CreateCodeListModal from './ModalCreateCodeList'

const CodeListPage = () => {
  const params: Readonly<
    Partial<{
      listname?: string
    }>
  > = useParams<{ listname?: string }>()
  const navigate: NavigateFunction = useNavigate()
  const [loading, setLoading] = useState(true)
  const [listname, setListname] = useState(params.listname)
  const [createCodeListModal, setCreateCodeListModal] = useState(false)
  const [errorOnResponse, setErrorOnResponse] = useState(null)
  const forceUpdate: () => void = useForceUpdate()
  useAwait(codelist.wait(), setLoading)

  ampli.logEvent('besøk', { side: 'Admin', url: '/admin/codelist/', app: 'Behandlingskatalogen', type: 'Kodeverk' })

  const lists: List | undefined = codelist.lists?.codelist
  const currentCodelist: Code[] | undefined = lists && listname ? lists[listname] : undefined

  const handleCreateCodelist = async (values: CodeListFormValues): Promise<void> => {
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

  const update = async (): Promise<void> => {
    await codelist.refreshCodeLists()
    forceUpdate()
  }

  useEffect(() => {
    if (listname && listname !== params.listname) {
      navigate(`/admin/codelist/${listname}`, { replace: true })
    }
  }, [listname, lists])

  return (
    <>
      {!user.isAdmin() ||
        (!lists && (
          <div role="main">
            <Loader size="2xlarge" />
          </div>
        ))}
      {user.isAdmin() ||
        (lists && (
          <div role="main">
            <Heading size="large" level="1">
              Administrering av kodeverk
            </Heading>
            {loading && <Loader />}{' '}
            {!loading && (
              <div className="flex justify-between w-full">
                <Select label="Velg kodeverk" hideLabel onChange={(event) => setListname(event.target.value)}>
                  <option value="">Velg kodeverk</option>
                  {codelist.makeIdLabelForAllCodeLists().map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.label}
                    </option>
                  ))}
                </Select>
                {listname && (
                  <div>
                    <Button icon={<PlusIcon aria-hidden />} variant="tertiary" onClick={() => setCreateCodeListModal(!createCodeListModal)}>
                      Opprett ny kode
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!loading && currentCodelist && (
              <div className="mt-4">
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
          </div>
        ))}
    </>
  )
}

export default CodeListPage
