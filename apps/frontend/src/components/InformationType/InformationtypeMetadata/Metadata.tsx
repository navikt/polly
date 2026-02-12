import { faExternalLinkAlt, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyLong, Link } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getTerm, mapTermToOption } from '../../../api/GetAllApi'
import { IInformationType, ITerm } from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { theme } from '../../../util'
import { termUrl } from '../../../util/config'
import { DotTags } from '../../common/DotTag'
import { Markdown } from '../../common/Markdown'
import RouteLink, { urlForObject } from '../../common/RouteLink'
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
    <div className="flex flex-col" style={{ gap: theme.sizing.scale800 }}>
      <div>
        <div className="flex" />
        <TextWithLabel
          label="Begrepsdefinisjon"
          text={term || 'Ingen begrepsdefinisjon oppgitt'}
          error={termError ? 'Kunne ikke finne begrepsdefinisjon' : undefined}
        />
        {termId && (
          <Link target="_blank" rel="noopener noreferrer" href={termUrl(termId)}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Link>
        )}
      </div>
      <div>
        <TextWithLabel
          label="Søkeord"
          compact
          text={
            keywords && keywords.length ? (
              <ul className="mt-0 list-disc list-inside">
                {keywords.map((keyword, index) => (
                  <li key={`${keyword}-${index}`}>
                    <BodyLong as="span">{keyword}</BodyLong>
                  </li>
                ))}
              </ul>
            ) : (
              'Ikke angitt'
            )
          }
        />
      </div>
      <div>
        <TextWithLabel label="Nyttig å vite om opplysningstypen">
          <Markdown source={description} />
        </TextWithLabel>
      </div>
    </div>
  )
}

interface IPropertDataProps {
  orgMaster?: ICode
  sources: ICode[]
  categories: ICode[]
  productTeams: string[]
  keywords: string[]
  sensitivity: ICode
  codelistUtils: ICodelistProps
}

const PropertyData = (props: IPropertDataProps) => {
  const { orgMaster, sources, categories, productTeams, sensitivity, codelistUtils } = props

  return (
    <div className="flex flex-col" style={{ gap: theme.sizing.scale800 }}>
      <div>
        <TextWithLabel label="Master i NAV">
          <DotTags
            list={EListName.SYSTEM}
            codes={orgMaster ? [orgMaster] : []}
            linkCodelist
            commaSeparator
            codelistUtils={codelistUtils}
          />
        </TextWithLabel>
      </div>
      <div>
        <TextWithLabel label="Kilder">
          {sources.length ? (
            <ul className="mt-0 list-disc list-inside">
              {sources.map((source, index) => (
                <li key={`${source.code}-${index}`}>
                  <RouteLink href={urlForObject(EListName.THIRD_PARTY, source.code)}>
                    {codelistUtils.getShortname(EListName.THIRD_PARTY, source.code)}
                  </RouteLink>
                </li>
              ))}
            </ul>
          ) : (
            'Ikke angitt'
          )}
        </TextWithLabel>
      </div>
      <div>
        <TextWithLabel
          label="Team"
          compact
          text={
            productTeams.length ? <TeamList teamIds={productTeams} variant="list" /> : 'Ikke angitt'
          }
        />
      </div>
      <div>
        <TextWithLabel label="Kategorier">
          <DotTags
            list={EListName.CATEGORY}
            codes={categories}
            linkCodelist
            commaSeparator
            codelistUtils={codelistUtils}
          />
        </TextWithLabel>
      </div>
      <div>
        <TextWithLabel
          label="Type personopplysning"
          text={sensitivity ? sensitivity.shortName : ''}
          icon={faUserShield}
          iconColor={sensitivityColor(sensitivity.code)}
        />
      </div>
    </div>
  )
}

interface IMetaDataProps {
  informationtype: IInformationType
  codelistUtils: ICodelistProps
}

const Metadata = (props: IMetaDataProps) => {
  const { informationtype, codelistUtils } = props

  return (
    <div className="flex mb-4">
      <div className="w-[40%] pr-24">
        <DescriptionData
          termId={informationtype.term}
          description={informationtype.description}
          keywords={informationtype.keywords}
        />
      </div>
      <div className="w-[60%] pl-24 border-solid border-l border-[#AFAFAF]">
        <PropertyData
          orgMaster={informationtype.orgMaster}
          sources={informationtype.sources || []}
          productTeams={informationtype.productTeams || []}
          categories={informationtype.categories || []}
          keywords={informationtype.keywords || []}
          sensitivity={informationtype.sensitivity}
          codelistUtils={codelistUtils}
        />
      </div>
    </div>
  )
}

export default Metadata
