import * as React from 'react'
import {useEffect} from 'react'

import ProcessList from '../components/Purpose'
import {Block} from 'baseui/block'
import {codelist, ListName} from '../service/Codelist'
import {intl} from '../util'
import {H4, Label2, Paragraph2} from 'baseui/typography'
import {RouteComponentProps} from 'react-router-dom'
import {ProductArea, Team} from '../constants'
import {getProductArea, getTeam} from '../api'
import {Markdown} from '../components/common/Markdown'

export enum Section {
  subdepartment = 'subdepartment',
  department = 'department',
  purpose = 'purpose',
  team = 'team',
  productarea = 'productarea',
  system = 'system'
}

const renderMetadata = (description: string, title: string) => (
  <Block marginBottom='scale1000'>
    <Label2 font='font400'>{title}</Label2>
    <Paragraph2 as='div'><Markdown source={description}/></Paragraph2>
  </Block>
)

export type Filter = 'ALL' | 'COMPLETED' | 'IN_PROGRESS'

export type PathParams = {
  section: Section,
  code: string,
  filter: Filter,
  processId?: string
}

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const [isLoading, setLoading] = React.useState(false)
  const [team, setTeam] = React.useState<Team>()
  const [productArea, setProductArea] = React.useState<ProductArea>()

  const {params} = props.match
  const {section, code, filter, processId} = params

  useEffect(() => {
    (async () => {
      if (code) {
        setLoading(true)
        if (section === 'team') {
          setTeam((await getTeam(code)))
        }
        if (section === 'productarea') {
          setProductArea((await getProductArea(code)))
        }
        setLoading(false)
      }
    })()
  }, [code, section])

  const getTitle = () => {
    let currentListName = getCurrentListName()
    if (currentListName !== undefined) {
      return codelist.getShortname(currentListName, code)
    }
    if (section === Section.team) {
      return team?.name || ''
    }
    if (section === Section.productarea) {
      return productArea?.name || ''
    }
    return intl.ERROR
  }

  const metadataTitle = () => {
    if (section === Section.subdepartment) return intl.subDepartment
    else if (section === Section.department) return intl.department
    else if (section === Section.team) return intl.team
    else if (section === Section.productarea) return intl.productArea
    else if (section === Section.system) return intl.system
    return intl.overallPurposeActivity
  }

  const getDescription = () => {
    let currentListName = getCurrentListName()
    if (currentListName) {
      return codelist.getDescription(currentListName, code)
    }
    if (section === Section.team) {
      return team?.description || ''
    }
    if (section === Section.productarea) {
      return productArea?.description || ''
    }
    return ''
  }

  const getCurrentListName = () => {
    if (section === Section.subdepartment) return ListName.SUB_DEPARTMENT
    else if (section === Section.department) return ListName.DEPARTMENT
    else if (section === Section.purpose) return ListName.PURPOSE
    else if (section === Section.system) return ListName.SYSTEM
    return undefined
  }

  return (
    <>
      {!isLoading && code && (
        <>
          <Block marginBottom="3rem">
            <H4>{getTitle()}</H4>
          </Block>

          {renderMetadata(getDescription(), metadataTitle())}
          <ProcessList code={code} listName={getCurrentListName()} processId={processId} filter={filter} section={section}/>
        </>
      )}
    </>
  )
}

export default PurposePage
