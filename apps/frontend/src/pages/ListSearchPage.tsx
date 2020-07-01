import * as React from 'react'
import {intl, useAwait} from '../util'
import {codelist, ListName} from '../service/Codelist'
import {H4} from 'baseui/typography'
import {StyledSpinnerNext} from 'baseui/spinner'
import AlphabeticList from '../components/common/AlphabeticList'

const listSearchPage = (title: string, listName: ListName, baseUrl: string) => () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  useAwait(codelist.wait(), setIsLoading)

  const list = codelist.getCodes(listName)

  return (
    <>
      <H4>{title}</H4>

      {isLoading && <StyledSpinnerNext/>}

      {!!list.length && (
        <AlphabeticList listName={listName} baseUrl={baseUrl}/>
      )}
    </>
  )
}

export const ThirdPartySearchPage = listSearchPage(intl.thirdParties, ListName.THIRD_PARTY, '/thirdparty/')
export const SystemSearchPage = listSearchPage(intl.systems, ListName.SYSTEM, '/system/')
