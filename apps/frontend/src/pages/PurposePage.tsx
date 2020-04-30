import * as React from 'react'
import { useEffect } from 'react'

import ProcessList from '../components/Purpose'
import { Block } from 'baseui/block'
import { codelist, ListName } from '../service/Codelist'
import { intl, theme, useAwait } from '../util'
import illustration from '../resources/purpose_illustration.svg'
import { H4, Label2, Paragraph2 } from 'baseui/typography'
import { useLocation } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

const routes = {
  subdepartment: 'subdepartment',
  department: 'department',
  purpose: 'purpose',
  team: 'team'
}

const renderMetadata = (description: string, title: string) => (
  <Block marginBottom='scale1000'>
    <Label2 font='font400'>{title}</Label2>
    <Paragraph2>{description}</Paragraph2>
  </Block>
)

export type PathParams = { code?: string, processId?: string }

const PurposePage = (props: RouteComponentProps<PathParams>) => {
  const current_location = useLocation()
  const [isLoading, setLoading] = React.useState(false)
  const [description, setDescription] = React.useState<string>('')

  useAwait(codelist.wait())

  useEffect(() => {
    (async () => {
      if (props.match.params.code) {
        setLoading(true)
        setDescription(getDescription(props.match.params.code))
        setLoading(false)
      }
    })()
  })

  const getTitle = (codeName: string) => {
    let currentListName = getCurrentListName()
    if (currentListName !== undefined) {
      return codelist.getShortname(currentListName, codeName)
    }
    return !props.match.params.code ? '' : props.match.params.code
  }

  const getDescription = (codeName: string) => {
    let currentListName = getCurrentListName()
    if (currentListName !== undefined) {
      return codelist.getDescription(currentListName, codeName)
    }
    return !props.match.params.code ? '' : props.match.params.code
  }

  const renderTitle = () => {
    let location = current_location.pathname
    if (location.includes(routes.subdepartment)) return intl.subDepartment
    else if (location.includes(routes.department)) return intl.department
    else if (location.includes(routes.team)) return intl.team
    return intl.overallPurpose
  }

  const getCurrentListName = () => {
    let location = current_location.pathname
    if (location.includes(routes.subdepartment)) return ListName.SUB_DEPARTMENT
    else if (location.includes(routes.department)) return ListName.DEPARTMENT
    else if (location.includes(routes.purpose)) return ListName.PURPOSE
    return undefined
  }

  return (
    <React.Fragment>
      {!isLoading && props.match.params.code && (
        <React.Fragment>
          <Block marginBottom='3rem'>
            <H4>{getTitle(props.match.params.code)}</H4>
          </Block>

          {renderMetadata(description, renderTitle())}
          <ProcessList code={props.match.params.code} listName={getCurrentListName()}/>
        </React.Fragment>
      )}


      {!props.match.params.code && (
        <Block display='flex' justifyContent='center' alignContent='center' marginTop={theme.sizing.scale2400}>
          <img src={illustration} alt={intl.treasureIllustration} style={{maxWidth: '65%'}}/>
        </Block>
      )}
    </React.Fragment>
  )
}

export default PurposePage
