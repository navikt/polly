import {Block} from 'baseui/block'
import {HeadingLarge, LabelLarge} from 'baseui/typography'
import {intl, theme} from '../../util'
import {Markdown} from './Markdown'
import * as React from 'react'
import {useEffect} from 'react'
import {codelist} from '../../service/Codelist'
import {listNameForSection, Section} from '../../pages/ProcessPage'
import {ProductArea, Team} from '../../constants'
import {getProductArea, getTeam} from '../../api'
import {Spinner} from './Spinner'
import {productAreaLink, teamLink} from '../../util/config'
import {StyledLink} from 'baseui/link'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'
import CustomizedStatefulTooltip from "./CustomizedStatefulTooltip"
import {lowerFirst} from 'lodash'

export const PageHeader = (props: {section: Section, code: string}) => {
  const [isLoading, setLoading] = React.useState(false)
  const [team, setTeam] = React.useState<Team>()
  const [productArea, setProductArea] = React.useState<ProductArea>()
  const {code, section} = props

  useEffect(() => {
    (async () => {
      setLoading(true)
      if (section === 'team') {
        setTeam((await getTeam(code)))
      }
      if (section === 'productarea') {
        setProductArea((await getProductArea(code)))
      }
      setLoading(false)
    })()
  }, [code, section])

  const getTitle = () => {
    let currentListName = listNameForSection(section)
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
    else if (section === Section.thirdparty) return `${intl.commonExternalProcessResponsible} ${intl.with} ${lowerFirst(intl.thirdParty)}`
    return intl.overallPurposeActivity
  }

  const getDescription = () => {
    let currentListName = listNameForSection(section)
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

  const externalLink = () => {
    let url
    if (section === Section.team) url = teamLink(code)
    else if (section === Section.productarea) url = productAreaLink(code)
    if (!url) return null
    return (
      <>
        <Block marginRight={theme.sizing.scale1200}/>
        <StyledLink target="_blank" rel="noopener noreferrer" href={url}>
          <CustomizedStatefulTooltip content={intl.goToSite}>
            <span><FontAwesomeIcon icon={faExternalLinkAlt} size='lg'/></span>
          </CustomizedStatefulTooltip>
        </StyledLink>
      </>
    )
  }

  return (
    <>
      {isLoading && <Spinner size={theme.sizing.scale2400}/>}
      {!isLoading &&
      <>
        <Block marginBottom="3rem" display='flex' alignItems='center'>
          <HeadingLarge>{getTitle()}</HeadingLarge>
          {externalLink()}
        </Block>

        <Block marginBottom='scale1000'>
          <LabelLarge marginBottom={theme.sizing.scale600}>{metadataTitle()}</LabelLarge>
          <Markdown source={getDescription()}/>
        </Block>
      </>}
    </>
  )
}
