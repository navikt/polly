import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Heading, Label, Link, Loader } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getProductArea, getTeam } from '../../api/GetAllApi'
import { getAvdelingByNomId } from '../../api/NomApi'
import { IProductArea, ITeam } from '../../constants'
import { ESection, listNameForSection } from '../../pages/ProcessPage'
import { CodelistService, EListName } from '../../service/Codelist'
import { theme } from '../../util'
import { productAreaLink, teamLink } from '../../util/config'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'
import { Markdown } from './Markdown'

interface IPageHeaderProps {
  section: ESection
  code: string
}

export const PageHeader = (props: IPageHeaderProps) => {
  const { code, section } = props
  const [codelistUtils] = CodelistService()
  const [nomAvdelingNavn, setNomAvdelingNavn] = useState<string>('')

  const [isLoading, setLoading] = useState(false)
  const [team, setTeam] = useState<ITeam>()
  const [productArea, setProductArea] = useState<IProductArea>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (section === 'team') {
        setTeam(await getTeam(code))
      } else if (section === 'productarea') {
        setProductArea(await getProductArea(code))
      } else if (section === 'department') {
        setNomAvdelingNavn((await getAvdelingByNomId(code)).navn)
      }
      setLoading(false)
    })()
  }, [code, section])

  const getTitle = () => {
    const currentListName: EListName | undefined = listNameForSection(section)
    if (section === ESection.department) {
      return nomAvdelingNavn
    }
    if (currentListName !== undefined) {
      return codelistUtils.getShortname(currentListName, code)
    }
    if (section === ESection.team) {
      return team?.name || ''
    }
    if (section === ESection.productarea) {
      return productArea?.name || ''
    }
    return 'Feil'
  }

  const metadataTitle = () => {
    if (section === ESection.subdepartment) return 'Linja'
    else if (section === ESection.department) return ''
    else if (section === ESection.team) return 'Team'
    else if (section === ESection.productarea) return 'Produktområde'
    else if (section === ESection.system) return 'System'
    else if (section === ESection.processor) return 'Databehandler'
    else if (section === ESection.thirdparty) return `Felles behandlingsansvarlig med ekstern part}`
    return 'Overordnet behandlingsaktivitet'
  }

  const getDescription = () => {
    const currentListName: EListName | undefined = listNameForSection(section)
    if (section === ESection.department) {
      return ''
    }
    if (currentListName) {
      return codelistUtils.getDescription(currentListName, code)
    }
    if (section === ESection.team) {
      return team?.description || ''
    }
    if (section === ESection.productarea) {
      return productArea?.description || ''
    }
    return ''
  }

  const externalLink = () => {
    let url
    if (section === ESection.team) url = teamLink(code)
    else if (section === ESection.productarea) url = productAreaLink(code)
    if (!url) return null

    return (
      <>
        <div className="mr-12" />
        <Link target="_blank" rel="noopener noreferrer" href={url}>
          <CustomizedStatefulTooltip
            content="Gå til side"
            icon={
              <span className="flex items-center leading-none">
                <ExternalLinkIcon aria-hidden className="block" />
              </span>
            }
          />
        </Link>
      </>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="mb-12 flex items-center">
            <Heading size="xlarge" level="1">
              {getTitle()}
            </Heading>
            {externalLink()}
          </div>

          <div className="mb-10">
            <Label style={{ marginBottom: theme.sizing.scale600 }}>{metadataTitle()}</Label>
            <div
              style={{
                maxWidth:
                  section === ESection.purpose || section === ESection.system ? '100ch' : '150ch',
              }}
            >
              <Markdown source={getDescription()} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
