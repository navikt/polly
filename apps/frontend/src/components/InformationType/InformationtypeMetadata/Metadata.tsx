import * as React from 'react'
import {ReactNode, useEffect, useState} from 'react'
import {Block} from 'baseui/block'
import {InformationType} from '../../../constants'
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid'
import {IconDefinition} from '@fortawesome/fontawesome-common-types'
import {intl, theme} from '../../../util'
import {Label2} from 'baseui/typography'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExternalLinkAlt, faTimesCircle, faUserShield} from '@fortawesome/free-solid-svg-icons'
import {Code} from '../../../service/Codelist'
import {sensitivityColor} from '../Sensitivity'
import {getTerm, mapTermToOption} from '../../../api'
import {PLACEMENT, StatefulTooltip} from 'baseui/tooltip'
import {StyledLink} from 'baseui/link'
import {marginZero} from '../../common/Style'
import {DotTags} from '../../common/DotTag'
import {termUrl} from '../../../util/config'

const renderCodesToLinks = (sources: Code[]) =>
  sources.map((source, index) => (
    <React.Fragment key={index}>
      <StyledLink href={`/thirdparty/${source.code}`}>{source.shortName}</StyledLink>
      <span>{index < sources.length - 1 ? ', ' : ''}</span>
    </React.Fragment>
  ))

const TextWithLabel = (props: { label: string, text: ReactNode, icon?: IconDefinition, iconColor?: string, error?: string }) => {
  const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/>
  const value =
    <Block font="ParagraphMedium"
           $style={{whiteSpace: 'pre-wrap', ...marginZero, marginTop: theme.sizing.scale100}}
           display="flex">
      {props.error && errorIcon} {props.text}
    </Block>

  return (
    <>
      <Label2>{props.icon && <FontAwesomeIcon icon={props.icon} color={props.iconColor}/>} {props.label}</Label2>
      {!props.error && value}
      {props.error && <StatefulTooltip content={props.error} placement={PLACEMENT.top}>{value}</StatefulTooltip>}
    </>
  )
}

const DescriptionData = (props: { termId?: string, description: string, keywords: string[] }) => {
  const [term, setTerm] = useState(props.termId)
  const [termError, setTermError] = useState(false)

  useEffect(() => {
    (async () => {
      if (props.termId) {
        try {
          const termResponse = await getTerm(props.termId)
          setTerm(mapTermToOption(termResponse).label)
        } catch (e) {
          console.error('couldnt find term', e)
          setTermError(true)
        }
      }
    })()
  }, [props.termId])

  return (
    <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
      <FlexGridItem>
        <Block display='flex'/>
        <TextWithLabel label={intl.term} text={term || intl.noTerm} error={termError ? intl.couldntLoadTerm : undefined}/>
        {props.termId && (
          <StyledLink target="_blank" rel="noopener noreferrer" href={termUrl(props.termId)}>
            <FontAwesomeIcon icon={faExternalLinkAlt}/>
          </StyledLink>
        )}
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label={intl.searchWords} text={<DotTags items={props.keywords}/>}/>
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label={intl.usefulInformation} text={props.description}/>
      </FlexGridItem>
    </FlexGrid>
  )
}

const PropertyData = (props: { navMaster: Code, sources: Code[], categories: Code[], keywords: string[], sensitivity: Code }) => (
  <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
    <FlexGridItem>
      <TextWithLabel label={intl.navMaster} text={props.navMaster ? props.navMaster.shortName : ''}/>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label={intl.sources} text={renderCodesToLinks(props.sources)}/>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label={intl.categories} text={(props.categories || []).map(c => c.shortName).join(', ')}/>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label={intl.sensitivity} text={props.sensitivity ? props.sensitivity.shortName : ''} icon={faUserShield} iconColor={sensitivityColor(props.sensitivity.code)}/>
    </FlexGridItem>
  </FlexGrid>
)

const Metadata = (props: { informationtype: InformationType }) => {
  const {informationtype} = props

  const dividerDistance = theme.sizing.scale2400
  return (
    <Block display="flex" marginBottom="1rem">
      <Block width="40%" paddingRight={dividerDistance}>
        <DescriptionData
          termId={informationtype.term}
          description={informationtype.description}
          keywords={informationtype.keywords}
        />
      </Block>
      <Block width="60%" paddingLeft={dividerDistance} $style={{borderLeft: `1px solid ${theme.colors.mono600}`}}>
        <PropertyData
          navMaster={informationtype.navMaster}
          sources={informationtype.sources ? informationtype.sources : []}
          categories={informationtype.categories ? informationtype.categories : []}
          keywords={informationtype.keywords ? informationtype.keywords : []}
          sensitivity={informationtype.sensitivity}
        />
      </Block>
    </Block>
  )
}

export default Metadata
