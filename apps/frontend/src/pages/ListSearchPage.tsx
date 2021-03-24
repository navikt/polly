import * as React from 'react'
import {intl, useAwait} from '../util'
import {codelist, ListName} from '../service/Codelist'
import {H4} from 'baseui/typography'
import {StyledSpinnerNext} from 'baseui/spinner'
import AlphabeticList from '../components/common/AlphabeticList'

const codelistPage = (listName: ListName, baseUrl: string, title?: string) => () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  useAwait(codelist.wait(), setIsLoading)

  const codes = listName == ListName.THIRD_PARTY ? codelist.getCodes(listName).filter(l => l.shortName != 'NAV') : codelist.getCodes(listName)

  return (
    <>
      {title && <H4>{title}</H4>}

      {isLoading && <StyledSpinnerNext/>}

      {!!codes.length && (
        <AlphabeticList items={codes.map(c => ({id: c.code, label: c.shortName}))} baseUrl={baseUrl}/>
      )}
    </>
  )
}


export const ThirdPartyListPage = codelistPage(ListName.THIRD_PARTY, '/thirdparty/', intl.thirdParties)
export const SystemListPage = codelistPage(ListName.SYSTEM, '/system/', intl.systems)
export const PurposeList = codelistPage(ListName.PURPOSE, '/process/purpose/')
