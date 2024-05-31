import * as React from 'react'
import { useEffect, useState } from 'react'
import { Block } from 'baseui/block'
import { InformationType } from '../../../constants'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { theme } from '../../../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { Code, ListName } from '../../../service/Codelist'
import { sensitivityColor } from '../Sensitivity'
import { getTerm, mapTermToOption } from '../../../api'
import { StyledLink } from 'baseui/link'
import { DotTags } from '../../common/DotTag'
import { termUrl } from '../../../util/config'
import { TeamList } from '../../common/Team'
import { Markdown } from '../../common/Markdown'
import TextWithLabel from '../../common/TextWithLabel'

const DescriptionData = (props: { termId?: string; description?: string; keywords: string[] }) => {
  const [term, setTerm] = useState(props.termId)
  const [termError, setTermError] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (props.termId) {
        try {
          const termResponse = await getTerm(props.termId)
          setTerm(mapTermToOption(termResponse).label)
        } catch (e: any) {
          console.error('couldnt find term', e)
          setTermError(true)
        }
      } else {
        setTerm('')
      }
    })()
  }, [props.termId])

  return (
    <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
      <FlexGridItem>
        <Block display="flex" />
        <TextWithLabel label='Begrepsdefinisjon' text={term || 'Ingen begrepsdefinisjon oppgitt'}
                       error={termError ? 'Kunne ikke finne begrepsdefinisjon' : undefined} />
        {props.termId && (
          <StyledLink target="_blank" rel="noopener noreferrer" href={termUrl(props.termId)}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </StyledLink>
        )}
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label='Søkeord' text={<DotTags items={props.keywords} />} />
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label='Nyttig å vite om opplysningstypen'>
          <Markdown source={props.description} />
        </TextWithLabel>
      </FlexGridItem>
    </FlexGrid>
  )
}

const PropertyData = (props: { orgMaster?: Code; sources: Code[]; categories: Code[]; productTeams: string[]; keywords: string[]; sensitivity: Code }) => (
  <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
    <FlexGridItem>
      <TextWithLabel label='Master i NAV'>
        <DotTags list={ListName.SYSTEM} codes={props.orgMaster ? [props.orgMaster] : []} linkCodelist commaSeparator />
      </TextWithLabel>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label='Kilder'>
        <DotTags list={ListName.THIRD_PARTY} codes={props.sources} linkCodelist commaSeparator />
      </TextWithLabel>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label='Team' text={props.productTeams.length ? <TeamList teamIds={props.productTeams} /> : 'Ikke angitt'} />
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel label='Kategorier'>
        <DotTags list={ListName.CATEGORY} codes={props.categories} linkCodelist commaSeparator />
      </TextWithLabel>
    </FlexGridItem>
    <FlexGridItem>
      <TextWithLabel
        label='Type personopplysning'
        text={props.sensitivity ? props.sensitivity.shortName : ''}
        icon={faUserShield}
        iconColor={sensitivityColor(props.sensitivity.code)}
      />
    </FlexGridItem>
  </FlexGrid>
)

const Metadata = (props: { informationtype: InformationType }) => {
  const { informationtype } = props

  const dividerDistance = theme.sizing.scale2400
  return (
    <Block display="flex" marginBottom="1rem">
      <Block width="40%" paddingRight={dividerDistance}>
        <DescriptionData termId={informationtype.term} description={informationtype.description} keywords={informationtype.keywords} />
      </Block>
      <Block width="60%" paddingLeft={dividerDistance} $style={{ borderLeft: `1px solid ${theme.colors.mono600}` }}>
        <PropertyData
          orgMaster={informationtype.orgMaster}
          sources={informationtype.sources || []}
          productTeams={informationtype.productTeams || []}
          categories={informationtype.categories || []}
          keywords={informationtype.keywords || []}
          sensitivity={informationtype.sensitivity}
        />
      </Block>
    </Block>
  )
}

export default Metadata
