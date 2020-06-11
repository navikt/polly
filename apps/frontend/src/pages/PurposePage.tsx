import * as React from 'react'
import { useEffect } from 'react'

import ProcessList from '../components/Purpose'
import { Block } from 'baseui/block'
import { codelist, ListName } from '../service/Codelist'
import { intl, useAwait } from '../util'
import { H4, Label2, Paragraph2 } from 'baseui/typography'
import { RouteComponentProps } from 'react-router-dom'
import { ProductArea, Team } from '../constants'
import { getProductArea, getTeam } from '../api'
import ReactMarkdown from 'react-markdown'

const routes = {
  subdepartment: 'subdepartment',
  department: 'department',
  purpose: 'purpose',
  team: 'team',
  productarea: 'productarea'
}

const renderMetadata = (description: string, title: string) => (
  <Block marginBottom='scale1000'>
    <Label2 font='font400'>{title}</Label2>
    <Paragraph2><ReactMarkdown source={description} linkTarget='_blank'/></Paragraph2>
  </Block>
)

export type PathParams = {
  section: 'purpose' | 'department' | 'subdepartment' | 'team' | 'productarea',
  code: string,
  processId?: string
}

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const [isLoading, setLoading] = React.useState(false)
  const [team, setTeam] = React.useState<Team>()
  const [productArea, setProductArea] = React.useState<ProductArea>()

  const {params} = props.match
  useAwait(codelist.wait())

  useEffect(() => {
    (async () => {
      if (params.code) {
        setLoading(true)
        if (params.section === 'team') {
          setTeam((await getTeam(params.code)))
        }
        if (params.section === 'productarea') {
          setProductArea((await getProductArea(params.code)))
        }
        setLoading(false)
      }
    })()
  }, [params])

  const getTitle = () => {
    let currentListName = getCurrentListName()
    if (currentListName !== undefined) {
      return codelist.getShortname(currentListName, params.code)
    }
    if (params.section === routes.team) {
      return team?.name || ''
    }
    if (params.section === routes.productarea) {
      return productArea?.name || ''
    }
    return intl.ERROR
  }

  const metadataTitle = () => {
    if (params.section === routes.subdepartment) return intl.subDepartment
    else if (params.section === routes.department) return intl.department
    else if (params.section === routes.team) return intl.team
    else if (params.section === routes.productarea) return intl.productArea
    return intl.overallPurpose
  }

  const getDescription = () => {
    let currentListName = getCurrentListName()
    if (currentListName) {
      return codelist.getDescription(currentListName, params.code)
    }
    if (params.section === routes.team) {
      return team?.description || ''
    }
    if (params.section === routes.productarea) {
      return productArea?.description || ''
    }
    return ''
  }

  const getCurrentListName = () => {
    if (params.section === routes.subdepartment) return ListName.SUB_DEPARTMENT
    else if (params.section === routes.department) return ListName.DEPARTMENT
    else if (params.section === routes.purpose) return ListName.PURPOSE
    return undefined
  }

  return (
    <>
      {!isLoading && params.code && (
        <>
          <Block marginBottom='3rem'>
            <H4>{getTitle()}</H4>
          </Block>

          {renderMetadata(getDescription(), metadataTitle())}
          <ProcessList code={params.code} listName={getCurrentListName()}/>
        </>
      )}
    </>
  )
}

export default PurposePage
