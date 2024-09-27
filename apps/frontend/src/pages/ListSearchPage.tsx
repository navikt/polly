import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useState } from 'react'
import AlphabeticList from '../components/common/AlphabeticList'
import { ampli } from '../service/Amplitude'
import { EListName, codelist } from '../service/Codelist'
import { useAwait } from '../util'

const CodelistPage = (listName: EListName, baseUrl: string, title?: string): JSX.Element => {
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

export const ThirdPartyListPage = CodelistPage(
  EListName.THIRD_PARTY,
  '/thirdparty/',
  'Eksterne parter'
)
export const SystemListPage = CodelistPage(EListName.SYSTEM, '/system/', 'Systemer')
export const PurposeList = CodelistPage(EListName.PURPOSE, '/process/purpose/')
