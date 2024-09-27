import { faExternalLinkAlt, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { StyledLink } from 'baseui/link'
import { useEffect, useState } from 'react'
import { getTerm, mapTermToOption } from '../../../api'
import { IInformationType, ITerm } from '../../../constants'
import { EListName, ICode } from '../../../service/Codelist'
import { theme } from '../../../util'
import { termUrl } from '../../../util/config'
import { DotTags } from '../../common/DotTag'
import { Markdown } from '../../common/Markdown'
import { TeamList } from '../../common/Team'
import TextWithLabel from '../../common/TextWithLabel'
import { sensitivityColor } from '../Sensitivity'

interface IDescriptionDataProps {
  termId?: string
  description?: string
  keywords: string[]
}

const DescriptionData = (props: IDescriptionDataProps) => {
  const { termId, description, keywords } = props
  const [term, setTerm] = useState(termId)
  const [termError, setTermError] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (termId) {
        try {
          const termResponse: ITerm = await getTerm(termId)
          setTerm(mapTermToOption(termResponse).label)
        } catch (error: any) {
          console.error('couldnt find term', error)
          setTermError(true)
        }
      } else {
        setTerm('')
      }
    })()
  }, [termId])

  return (
    <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
      <FlexGridItem>
        <div className="flex" />
        <TextWithLabel
          label="Begrepsdefinisjon"
          text={term || 'Ingen begrepsdefinisjon oppgitt'}
          error={termError ? 'Kunne ikke finne begrepsdefinisjon' : undefined}
        />
        {termId && (
          <StyledLink target="_blank" rel="noopener noreferrer" href={termUrl(termId)}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </StyledLink>
        )}
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label="Søkeord" text={<DotTags items={keywords} />} />
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label="Nyttig å vite om opplysningstypen">
          <Markdown source={description} />
        </TextWithLabel>
      </FlexGridItem>
    </FlexGrid>
  )
}

interface IPropertDataProps {
  orgMaster?: ICode
  sources: ICode[]
  categories: ICode[]
  productTeams: string[]
  keywords: string[]
  sensitivity: ICode
}

const PropertyData = (props: IPropertDataProps) => {
  const { orgMaster, sources, categories, productTeams, sensitivity } = props

  return (
    <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
      <FlexGridItem>
        <TextWithLabel label="Master i NAV">
          <DotTags
            list={EListName.SYSTEM}
            codes={orgMaster ? [orgMaster] : []}
            linkCodelist
            commaSeparator
          />
        </TextWithLabel>
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label="Kilder">
          <DotTags list={EListName.THIRD_PARTY} codes={sources} linkCodelist commaSeparator />
        </TextWithLabel>
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel
          label="Team"
          text={productTeams.length ? <TeamList teamIds={productTeams} /> : 'Ikke angitt'}
        />
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel label="Kategorier">
          <DotTags list={EListName.CATEGORY} codes={categories} linkCodelist commaSeparator />
        </TextWithLabel>
      </FlexGridItem>
      <FlexGridItem>
        <TextWithLabel
          label="Type personopplysning"
          text={sensitivity ? sensitivity.shortName : ''}
          icon={faUserShield}
          iconColor={sensitivityColor(sensitivity.code)}
        />
      </FlexGridItem>
    </FlexGrid>
  )
}

interface IMetaDataProps {
  informationtype: IInformationType
}

const Metadata = (props: IMetaDataProps) => {
  const { informationtype } = props

  return (
    <div className="flex mb-4">
      <div className="w-[40%] pr-24">
        <DescriptionData
          termId={informationtype.term}
          description={informationtype.description}
          keywords={informationtype.keywords}
        />
      </div>
      <div className="w-[60%] pl-24 border-solid border-l-[1px] border-[#AFAFAF]">
        <PropertyData
          orgMaster={informationtype.orgMaster}
          sources={informationtype.sources || []}
          productTeams={informationtype.productTeams || []}
          categories={informationtype.categories || []}
          keywords={informationtype.keywords || []}
          sensitivity={informationtype.sensitivity}
        />
      </div>
    </div>
  )
}

export default Metadata
