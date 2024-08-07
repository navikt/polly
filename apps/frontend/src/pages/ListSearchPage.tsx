import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useState } from 'react'
import AlphabeticList from '../components/common/AlphabeticList'
import { ampli } from '../service/Amplitude'
import { codelist, ListName } from '../service/Codelist'
import { useAwait } from '../util'

const codelistPage = (listName: ListName, baseUrl: string, title?: string) => () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useAwait(codelist.wait(), setIsLoading)

  ampli.logEvent('besøk', { side: 'Listevisning', url: baseUrl, app: 'Behandlingskatalogen', type: title })

  const codes = listName === ListName.THIRD_PARTY ? codelist.getCodes(listName).filter((l) => l.shortName !== 'NAV') : codelist.getCodes(listName)

  return (
    <>
      {title && <HeadingMedium>{title}</HeadingMedium>}
      {isLoading && <Spinner />}
      {!!codes.length && <AlphabeticList items={codes.map((c) => ({ id: c.code, label: c.shortName }))} baseUrl={baseUrl} />}
    </>
  )
}

export const ThirdPartyListPage = codelistPage(ListName.THIRD_PARTY, '/thirdparty/', 'Eksterne parter')
export const SystemListPage = codelistPage(ListName.SYSTEM, '/system/', 'Systemer')
export const PurposeList = codelistPage(ListName.PURPOSE, '/process/purpose/')
