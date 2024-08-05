import { faCircleExclamation, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'baseui/button'
import { StyledLink } from 'baseui/link'
import { ARTWORK_SIZES, ListItem } from 'baseui/list'
import { ParagraphMedium } from 'baseui/typography'
import { Fragment } from 'react/jsx-runtime'
import { LegalBasis, LegalBasisFormValues, PolicyAlert } from '../../constants'
import { ListName, SensitivityLevel, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import { env } from '../../util/env'
import { processString } from '../../util/string-processor'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

interface ILegalBasisViewProps {
  legalBasis?: LegalBasis
  legalBasisForm?: LegalBasisFormValues
}

export const LegalBasisView = (props: ILegalBasisViewProps) => {
  const { legalBasis, legalBasisForm } = props
  const input = legalBasis ? legalBasis : legalBasisForm
  if (!input) return null
  const { description } = input
  const gdpr = legalBasis ? legalBasis.gdpr.code : legalBasisForm!.gdpr
  const nationalLaw = legalBasis ? legalBasis?.nationalLaw?.code : legalBasisForm!.nationalLaw

  let gdprDisplay: string | undefined = gdpr && codelist.getShortname(ListName.GDPR_ARTICLE, gdpr)
  let nationalLawDisplay: string | undefined = nationalLaw && codelist.getShortname(ListName.NATIONAL_LAW, nationalLaw)

  let descriptionText: string | JSX.Element[] | undefined = codelist.valid(ListName.NATIONAL_LAW, nationalLaw) ? legalBasisLinkProcessor(nationalLaw!, description) : description

  return (
    <span>
      {gdprDisplay}
      {(nationalLawDisplay || descriptionText) && ', '} {nationalLawDisplay} {descriptionText}
    </span>
  )
}

const lovdataBase = (nationalLaw: string): string =>
  (codelist.isForskrift(nationalLaw) ? env.lovdataForskriftBaseUrl : env.lovdataLovBaseUrl) + codelist.getDescription(ListName.NATIONAL_LAW, nationalLaw)

const legalBasisLinkProcessor = (law: string, text?: string) => {
  const lawCode: string = codelist.getDescription(ListName.NATIONAL_LAW, law)
  if (!lawCode.match(/^\d+.*/)) {
    return text
  }

  return processString([
    {
      // Replace '§§ 10 og 4' > '§§ 10 og §§§ 4', so that our rewriter picks up the 2nd part
      regex: /§§\s*(\d+(-\d+)?)\s*og\s*(\d+(-\d+)?)/gi,
      fn: (key: string, result: string[]) => `§§ ${result[1]} og §§§ ${result[3]}`,
    },
    {
      // tripe '§§§' is hidden, used as a trick in combination with rule 1 above
      regex: /§(§§)?(§)?\s*(\d+(-\d+)?)/g,
      fn: (key: string, result: string[]) => (
        <StyledLink key={key} href={`${lovdataBase(law)}/§${result[3]}`} target="_blank" rel="noopener noreferrer">
          {!result[1] && !result[2] && '§'} {result[2] && '§§'} {result[3]}
        </StyledLink>
      ),
    },
    {
      regex: /kap(ittel)?\s*(\d+)/gi,
      fn: (key: string, result: string[]) => (
        <StyledLink key={key} href={`${lovdataBase(law)}/KAPITTEL_${result[2]}`} target="_blank" rel="noopener noreferrer">
          Kapittel {result[2]}
        </StyledLink>
      ),
    },
  ])(text)
}

interface ILegalBasesNotClarifiedProps {
  alert?: PolicyAlert
}

export const LegalBasesNotClarified = (props: ILegalBasesNotClarifiedProps) => {
  const { alert } = props

  const warningIcon = (
    <span>
      <FontAwesomeIcon icon={faCircleExclamation} color="{color}" />
      &nbsp;
    </span>
  )

  return (
    <div className="text-[#E85C4A]">
      <div>
        {alert?.missingLegalBasis && (
          <CustomizedStatefulTooltip content="Alle behandlinger av personopplysninger må ha et rettslig grunnlag iht. personopplysningsloven artikkel 6.">
            <span>{warningIcon} Behandlingsgrunnlag er ikke avklart</span>
          </CustomizedStatefulTooltip>
        )}
      </div>
      <div>
        {alert?.excessInfo && (
          <CustomizedStatefulTooltip content={'Informasjon som er tilgjengelig i dokumenter eller systemet som brukes, uten at dette trengs eller brukes i behandlingen.'}>
            <span>{warningIcon} Overskuddsinformasjon</span>
          </CustomizedStatefulTooltip>
        )}
      </div>
      <div>
        {alert?.missingArt6 && (
          <CustomizedStatefulTooltip content="Alle behandlinger av personopplysninger må ha et rettslig grunnlag iht. personopplysningsloven artikkel 6.">
            <span>{warningIcon} Behandlingsgrunnlag for artikkel 6 mangler</span>
          </CustomizedStatefulTooltip>
        )}
      </div>
      <div>
        {alert?.missingArt9 && (
          <CustomizedStatefulTooltip content="Behandling av personopplysninger som anses som særlige kategorier (tidl. sensitive opplysninger) krever et ytterligere behandlingsgrunnlag iht. personopplysningsloven art. 9">
            <span>{warningIcon} Behandlingsgrunnlag for artikkel 9 mangler</span>
          </CustomizedStatefulTooltip>
        )}
      </div>
    </div>
  )
}

const isLegalBasisFilteredBySensitivity = (legalBasis: LegalBasisFormValues, sensitivityLevel?: SensitivityLevel) => {
  return (
    (sensitivityLevel === SensitivityLevel.ART6 && codelist.isArt6(legalBasis.gdpr)) ||
    (sensitivityLevel === SensitivityLevel.ART9 && codelist.isArt9(legalBasis.gdpr)) ||
    !sensitivityLevel
  )
}

interface IListLegalBasesProps {
  legalBases?: LegalBasisFormValues[]
  onRemove: (index: number) => void
  onEdit: (index: number) => void
  sensitivityLevel?: SensitivityLevel.ART6 | SensitivityLevel.ART9
}

export const ListLegalBases = (props: IListLegalBasesProps) => {
  const { legalBases, onRemove, onEdit, sensitivityLevel } = props

  if (!legalBases) return null

  return (
    <Fragment>
      {legalBases
        .filter((legalBase: LegalBasisFormValues) => isLegalBasisFilteredBySensitivity(legalBase, sensitivityLevel))
        .map((legalBasis: LegalBasisFormValues, index: number) => (
          <ListItem
            artworkSize={ARTWORK_SIZES.SMALL}
            overrides={{
              Content: {
                style: {
                  height: 'auto',
                },
              },
              EndEnhancerContainer: {},
              Root: {},
              ArtworkContainer: {},
            }}
            endEnhancer={() => (
              <div className="w-full">
                <Button
                  type="button"
                  kind="tertiary"
                  size="compact"
                  onClick={() => {
                    onEdit(legalBases?.findIndex((legalBase: LegalBasisFormValues) => legalBase.key === legalBasis.key))
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  type="button"
                  kind="tertiary"
                  size="compact"
                  onClick={() => {
                    onRemove(legalBases?.findIndex((legalBase: LegalBasisFormValues) => legalBase.key === legalBasis.key))
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            )}
            sublist
            key={index}
          >
            <ParagraphMedium $style={{ marginTop: theme.sizing.scale100, marginBottom: theme.sizing.scale100 }}>
              <LegalBasisView legalBasisForm={legalBasis} />
            </ParagraphMedium>
          </ListItem>
        ))}
    </Fragment>
  )
}

interface IListLegalBasesInTableProps {
  legalBases: LegalBasis[]
}

export const ListLegalBasesInTable = (props: IListLegalBasesInTableProps) => {
  const { legalBases } = props

  return (
    <div>
      <ul style={{ listStyle: 'none', paddingInlineStart: 0, marginTop: 0, marginBottom: 0 }}>
        {legalBases.map((legalBasis: LegalBasis, index: number) => (
          <div className="mb-2" key={index}>
            <li>
              <LegalBasisView legalBasis={legalBasis} />
            </li>
          </div>
        ))}
      </ul>
    </div>
  )
}
