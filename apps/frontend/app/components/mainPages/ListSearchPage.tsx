'use client'

import { CodelistContext } from '@/provider/kodeverkProvider'
import { EListName, ICode } from '@/service/Codelist'
import { Heading, Loader } from '@navikt/ds-react'
import { useContext, useEffect, useState } from 'react'
import AlphabeticList from '../common/AlphabeticList'

interface ICodeListPageProps {
  listName: EListName
  baseUrl: string
  title?: string
  columns?: number
}

const CodelistPage = (props: ICodeListPageProps) => {
  const { listName, baseUrl, title, columns } = props
  const { utils: codelistUtils } = useContext(CodelistContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      if (codelistUtils.isLoaded()) {
        setIsLoading(false)
      }
    })()
  }, [codelistUtils])

  const codes =
    listName === EListName.THIRD_PARTY
      ? codelistUtils.getCodes(listName).filter((listName: ICode) => listName.shortName !== 'NAV')
      : codelistUtils.getCodes(listName)

  return (
    <>
      {title && <Heading size='large'>{title}</Heading>}
      {isLoading && (
        <div className='flex w-full justify-center'>
          <Loader size='3xlarge' />
        </div>
      )}
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
    baseUrl='/thirdparty/'
    title='Eksterne parter'
    columns={1}
  />
)
export const SystemListPage = () => (
  <CodelistPage listName={EListName.SYSTEM} baseUrl='/system/' title='Systemer' columns={1} />
)
export const PurposeList = () => (
  <CodelistPage listName={EListName.PURPOSE} baseUrl='/process/purpose/' columns={1} />
)
