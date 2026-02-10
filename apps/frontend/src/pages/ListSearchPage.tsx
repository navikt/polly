import { Heading, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import AlphabeticList from '../components/common/AlphabeticList'
import { CodelistService, EListName, ICode } from '../service/Codelist'

interface ICodeListPageProps {
  listName: EListName
  baseUrl: string
  title?: string
  columns?: number
}

const CodelistPage = (props: ICodeListPageProps) => {
  const { listName, baseUrl, title, columns } = props
  const [codelistUtils] = CodelistService()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (codelistUtils.isLoaded()) {
      setIsLoading(false)
    }
  }, [codelistUtils])

  const codes =
    listName === EListName.THIRD_PARTY
      ? codelistUtils.getCodes(listName).filter((listName: ICode) => listName.shortName !== 'NAV')
      : codelistUtils.getCodes(listName)

  return (
    <>
      {title && <Heading size="large">{title}</Heading>}
      {isLoading && <Loader size="large" />}
      {!!codes.length && (
        <AlphabeticList
          items={codes.map((code: ICode) => ({ id: code.code, label: code.shortName }))}
          baseUrl={baseUrl}
          columns={columns}
        />
      )}
    </>
  )
}

export const ThirdPartyListPage = () => (
  <CodelistPage
    listName={EListName.THIRD_PARTY}
    baseUrl="/thirdparty/"
    title="Eksterne parter"
    columns={1}
  />
)
export const SystemListPage = () => (
  <CodelistPage listName={EListName.SYSTEM} baseUrl="/system/" title="Systemer" columns={1} />
)
export const PurposeList = () => (
  <CodelistPage listName={EListName.PURPOSE} baseUrl="/process/purpose/" />
)
