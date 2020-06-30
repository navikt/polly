import * as React from 'react'
import {useEffect} from 'react'

import ProcessList from '../components/Purpose'
import {Block} from 'baseui/block'
import {codelist, ListName} from '../service/Codelist'
import {intl, theme} from '../util'
import {H4, LabelLarge, Paragraph2} from 'baseui/typography'
import {generatePath, useParams} from 'react-router-dom'
import {Process, ProcessStatus, ProductArea, Team} from '../constants'
import {getProductArea, getTeam} from '../api'
import {Markdown} from '../components/common/Markdown'
import {useQueryParam} from '../util/hooks'
import {processPath} from '../routes'

export enum Section {
  purpose = 'purpose',
  system = 'system',
  department = 'department',
  subdepartment = 'subdepartment',
  team = 'team',
  productarea = 'productarea'
}

export type PathParams = {
  section: Section,
  code: string,
  processId?: string
}

const ProcessPage = () => {
  const [isLoading, setLoading] = React.useState(false)
  const [team, setTeam] = React.useState<Team>()
  const [productArea, setProductArea] = React.useState<ProductArea>()
  const filter = useQueryParam<ProcessStatus>('filter')
  const params = useParams<PathParams>()
  const {section, code, processId} = params

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

          <Block marginBottom='scale1000'>
            <LabelLarge marginBottom={theme.sizing.scale600}>{metadataTitle()}</LabelLarge>
            <Paragraph2 as='div'><Markdown source={getDescription()}/></Paragraph2>
          </Block>
          <ProcessList code={code} listName={getCurrentListName()} processId={processId} filter={filter} section={section}/>
        </>
      )}
    </>
  )
}

export default ProcessPage

export const genProcessPath = (section: Section, code: string, process?: Partial<Process>, filter?: ProcessStatus) =>
  generatePath(processPath, {
    section,
    code: section === Section.purpose && !!process?.purpose ? process.purpose.code : code,
    processId: process?.id
  }) + (filter ? `?filter=${filter}` : '')
