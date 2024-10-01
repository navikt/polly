import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useState } from 'react'
import AlphabeticList from '../components/common/AlphabeticList'
import { ampli } from '../service/Amplitude'
import { EListName, codelist } from '../service/Codelist'
import { useAwait } from '../util'

interface ICodeListPageProps {
  listName: EListName
  baseUrl: string
  title?: string
}

const CodelistPage = (props: ICodeListPageProps) => {
  const {listName, baseUrl, title} = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useAwait(codelist.wait(), setIsLoading)

  ampli.logEvent('besøk', {
    side: 'Listevisning',
    url: baseUrl,
    app: 'Behandlingskatalogen',
    type: title,
  })

  const codes =
    listName === EListName.THIRD_PARTY
      ? codelist.getCodes(listName).filter((l) => l.shortName !== 'NAV')
      : codelist.getCodes(listName)

  return (
    <>
      {title && <HeadingMedium>{title}</HeadingMedium>}
      {isLoading && <Spinner />}
      {!!codes.length && (
        <AlphabeticList
          items={codes.map((c) => ({ id: c.code, label: c.shortName }))}
          baseUrl={baseUrl}
        />
      )}
    </>
  )
}

export const ThirdPartyListPage = () => <CodelistPage listName={EListName.THIRD_PARTY} baseUrl="/thirdparty/" title="Eksterne parter" />
export const SystemListPage = () => <CodelistPage listName={EListName.SYSTEM} baseUrl="/system/" title="Systemer" />
export const PurposeList = () => <CodelistPage listName={EListName.PURPOSE} baseUrl="/process/purpose/" />
