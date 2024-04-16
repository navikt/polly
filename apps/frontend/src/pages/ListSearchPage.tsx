import * as React from 'react'
import { intl, useAwait } from '../util'
import { codelist, ListName } from '../service/Codelist'
import { HeadingMedium } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'
import AlphabeticList from '../components/common/AlphabeticList'
import {ampli} from "../service/Amplitude";

const codelistPage = (listName: ListName, baseUrl: string, title?: string) => () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  useAwait(codelist.wait(), setIsLoading)

  ampli.logEvent("besøk", {side: 'Listevisning', url: baseUrl, app: 'Behandlingskatalogen', type:  title})

  const codes = listName == ListName.THIRD_PARTY ? codelist.getCodes(listName).filter((l) => l.shortName != 'NAV') : codelist.getCodes(listName)

  return (
    <>
      {title && <HeadingMedium>{title}</HeadingMedium>}

      {isLoading && <Spinner />}

      {!!codes.length && <AlphabeticList items={codes.map((c) => ({ id: c.code, label: c.shortName }))} baseUrl={baseUrl} />}
    </>
  )
}

export const ThirdPartyListPage = codelistPage(ListName.THIRD_PARTY, '/thirdparty/', "Eksterne parter")
export const SystemListPage = codelistPage(ListName.SYSTEM, '/system/', "Systemer")
export const PurposeList = codelistPage(ListName.PURPOSE, '/process/purpose/')
