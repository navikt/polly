import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useState } from 'react'
import AlphabeticList from '../components/common/AlphabeticList'
import { ampli } from '../service/Amplitude'
import { CodelistService, EListName, ICode } from '../service/Codelist'
import { useAwait } from '../util'

interface ICodeListPageProps {
  listName: EListName
  baseUrl: string
  title?: string
}

const CodelistPage = (props: ICodeListPageProps) => {
  const { listName, baseUrl, title } = props
  const [codelistUtils] = CodelistService()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  useAwait(codelistUtils.fetchData(), setIsLoading)

  ampli.logEvent('besøk', {
    side: 'Listevisning',
    url: baseUrl,
    app: 'Behandlingskatalogen',
    type: title,
  })

  const codes =
    listName === EListName.THIRD_PARTY
      ? codelistUtils.getCodes(listName).filter((listName: ICode) => listName.shortName !== 'NAV')
      : codelistUtils.getCodes(listName)

  return (
    <>
      {title && <HeadingMedium>{title}</HeadingMedium>}
      {isLoading && <Spinner />}
      {!!codes.length && (
        <AlphabeticList
          items={codes.map((code: ICode) => ({ id: code.code, label: code.shortName }))}
          baseUrl={baseUrl}
        />
      )}
    </>
  )
}

export const ThirdPartyListPage = () => (
  <CodelistPage listName={EListName.THIRD_PARTY} baseUrl="/thirdparty/" title="Eksterne parter" />
)
export const SystemListPage = () => (
  <CodelistPage listName={EListName.SYSTEM} baseUrl="/system/" title="Systemer" />
)
export const PurposeList = () => (
  <CodelistPage listName={EListName.PURPOSE} baseUrl="/process/purpose/" />
)
