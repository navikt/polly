import { PlusIcon } from '@navikt/aksel-icons'
import { Button, Heading, Loader, Select } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { createCodelist } from '../../../api/GetAllApi'
import { ICodeListFormValues } from '../../../constants'
import { CodelistService, ICode, IMakeIdLabelForAllCodeListsProps } from '../../../service/Codelist'
import { user } from '../../../service/User'
import CodeListTable from './CodeListStyledTable'
import CreateCodeListModal from './ModalCreateCodeList'

const CodeListPage = () => {
  const params: Readonly<
    Partial<{
      listname?: string
    }>
  > = useParams<{ listname?: string }>()
  const navigate: NavigateFunction = useNavigate()
  const [codelistUtils, lists] = CodelistService()

  const [loading, setLoading] = useState(true)
  const [listname, setListname] = useState(params.listname)
  const [createCodeListModal, setCreateCodeListModal] = useState(false)
  const [errorOnResponse, setErrorOnResponse] = useState(null)

  const currentCodelist: ICode[] | undefined =
    lists && listname ? lists?.codelist[listname] : undefined

  const handleCreateCodelist = async (values: ICodeListFormValues): Promise<void> => {
    setLoading(true)
    try {
      await createCodelist({ ...values } as ICode)
      await codelistUtils.fetchData(true)
      setCreateCodeListModal(false)
    } catch (error: any) {
      setCreateCodeListModal(true)
      setErrorOnResponse(error.message)
    }
    setLoading(false)
  }

  const update = async (): Promise<void> => {
    await codelistUtils.fetchData(true)
  }

  useEffect(() => {
    if (listname && listname !== params.listname) {
      navigate(`/admin/codelist/${listname}`, { replace: true })
    }
  }, [listname, lists])

  useEffect(() => {
    setLoading(!codelistUtils.isLoaded())
  }, [lists])

  return (
    <>
      {!(user.isAdmin() || lists) && (
        <div role="main" className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
      {user.isAdmin() && lists && (
        <div role="main">
          <Heading size="large" level="1">
            Administrering av kodeverk
          </Heading>
          {loading && (
            <div className="flex w-full justify-center">
              <Loader size="3xlarge" />
            </div>
          )}
          {!loading && (
            <div className="flex justify-between w-full">
              <Select
                label="Velg kodeverk"
                hideLabel
                onChange={(event) => setListname(event.target.value)}
              >
                <option value="">Velg kodeverk</option>
                {codelistUtils
                  .makeIdLabelForAllCodeLists()
                  .map((value: IMakeIdLabelForAllCodeListsProps) => (
                    <option key={value.id} value={value.id}>
                      {value.label}
                    </option>
                  ))}
              </Select>
              {listname && (
                <div>
                  <Button
                    icon={<PlusIcon aria-hidden />}
                    variant="tertiary"
                    onClick={() => setCreateCodeListModal(!createCodeListModal)}
                  >
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
          {listname && (
            <CreateCodeListModal
              title="Ny kode"
              list={listname}
              isOpen={createCodeListModal}
              errorOnCreate={errorOnResponse}
              onClose={() => {
                setCreateCodeListModal(false)
                setErrorOnResponse(null)
              }}
              submit={handleCreateCodelist}
            />
          )}
        </div>
      )}
    </>
  )
}

export default CodeListPage
