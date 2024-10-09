import { faCircleExclamation, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@navikt/ds-react'
import { StyledLink } from 'baseui/link'
import { ARTWORK_SIZES, ListItem } from 'baseui/list'
import { Tooltip } from 'baseui/tooltip'
import { ParagraphMedium } from 'baseui/typography'
import { Fragment } from 'react/jsx-runtime'
import { ILegalBasis, ILegalBasisFormValues, IPolicyAlert } from '../../constants'
import { EListName, ESensitivityLevel, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import { env } from '../../util/env'
import { processString } from '../../util/string-processor'

interface ILegalBasisViewProps {
  legalBasis?: ILegalBasis
  legalBasisForm?: ILegalBasisFormValues
}

export const LegalBasisView = (props: ILegalBasisViewProps) => {
  const { legalBasis, legalBasisForm } = props
  const input = legalBasis ? legalBasis : legalBasisForm
  if (!input) return null
  const { description } = input
  const gdpr = legalBasis ? legalBasis.gdpr.code : legalBasisForm!.gdpr
  const nationalLaw = legalBasis ? legalBasis?.nationalLaw?.code : legalBasisForm!.nationalLaw

  const gdprDisplay: string | undefined =
    gdpr && codelist.getShortname(EListName.GDPR_ARTICLE, gdpr)
  const nationalLawDisplay: string | undefined =
    nationalLaw && codelist.getShortname(EListName.NATIONAL_LAW, nationalLaw)

  const descriptionText: string | JSX.Element[] | undefined = codelist.valid(
    EListName.NATIONAL_LAW,
    nationalLaw
  )
    ? legalBasisLinkProcessor(nationalLaw!, description)
    : description

  return (
    <span>
      {gdprDisplay}
      {(nationalLawDisplay || descriptionText) && ', '} {nationalLawDisplay} {descriptionText}
    </span>
  )
}

const lovdataBase = (nationalLaw: string): string =>
  (codelist.isForskrift(nationalLaw) ? env.lovdataForskriftBaseUrl : env.lovdataLovBaseUrl) +
  codelist.getDescription(EListName.NATIONAL_LAW, nationalLaw)

const legalBasisLinkProcessor = (law: string, text?: string) => {
  const lawCode: string = codelist.getDescription(EListName.NATIONAL_LAW, law)
  if (!lawCode.match(/^\d+.*/)) {
    return text
  }

  return processString([
    {
      // Replace '§§ 10 og 4' > '§§ 10 og §§§ 4', so that our rewriter picks up the 2nd part
      regex: /§§\s*(\d+(-\d+)?)\s*og\s*(\d+(-\d+)?)/gi,
      fn: (_key: string, result: string[]) => `§§ ${result[1]} og §§§ ${result[3]}`,
    },
    {
      // tripe '§§§' is hidden, used as a trick in combination with rule 1 above
      regex: /§(§§)?(§)?\s*(\d+(-\d+)?)/g,
      fn: (key: string, result: string[]) => (
        <StyledLink
          key={key}
          href={`${lovdataBase(law)}/§${result[3]}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!result[1] && !result[2] && '§'} {result[2] && '§§'} {result[3]}
        </StyledLink>
      ),
    },
    {
      regex: /kap(ittel)?\s*(\d+)/gi,
      fn: (key: string, result: string[]) => (
        <StyledLink
          key={key}
          href={`${lovdataBase(law)}/KAPITTEL_${result[2]}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kapittel {result[2]}
        </StyledLink>
      ),
    },
  ])(text)
}

interface ILegalBasesNotClarifiedProps {
  alert?: IPolicyAlert
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
          <Tooltip content="Alle behandlinger av personopplysninger må ha et rettslig grunnlag iht. personopplysningsloven artikkel 6.">
            <Button type="button" variant="tertiary-neutral" size="small">
              {warningIcon} Behandlingsgrunnlag er ikke avklart
            </Button>
          </Tooltip>
        )}
      </div>
      <div>
        {alert?.excessInfo && (
          <Tooltip
            content={
              'Informasjon som er tilgjengelig i dokumenter eller systemet som brukes, uten at dette trengs eller brukes i behandlingen.'
            }
          >
            <Button type="button" variant="tertiary-neutral" size="small">
              {warningIcon} Overskuddsinformasjon
            </Button>
          </Tooltip>
        )}
      </div>
      <div>
        {alert?.missingArt6 && (
          <Tooltip content="Alle behandlinger av personopplysninger må ha et rettslig grunnlag iht. personopplysningsloven artikkel 6.">
            <Button type="button" variant="tertiary-neutral" size="small">
              {warningIcon} Behandlingsgrunnlag for artikkel 6 mangler
            </Button>
          </Tooltip>
        )}
      </div>
      <div>
        {alert?.missingArt9 && (
          <Tooltip content="Behandling av personopplysninger som anses som særlige kategorier (tidl. sensitive opplysninger) krever et ytterligere behandlingsgrunnlag iht. personopplysningsloven art. 9">
            <Button type="button" variant="tertiary-neutral" size="small">
              {warningIcon} Behandlingsgrunnlag for artikkel 9 mangler
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

const isLegalBasisFilteredBySensitivity = (
  legalBasis: ILegalBasisFormValues,
  sensitivityLevel?: ESensitivityLevel
) => {
  return (
    (sensitivityLevel === ESensitivityLevel.ART6 && codelist.isArt6(legalBasis.gdpr)) ||
    (sensitivityLevel === ESensitivityLevel.ART9 && codelist.isArt9(legalBasis.gdpr)) ||
    !sensitivityLevel
  )
}

interface IListLegalBasesProps {
  legalBases?: ILegalBasisFormValues[]
  onRemove: (index: number) => void
  onEdit: (index: number) => void
  sensitivityLevel?: ESensitivityLevel.ART6 | ESensitivityLevel.ART9
}

export const ListLegalBases = (props: IListLegalBasesProps) => {
  const { legalBases, onRemove, onEdit, sensitivityLevel } = props

  if (!legalBases) return null

  return (
    <Fragment>
      {legalBases
        .filter((legalBase: ILegalBasisFormValues) =>
          isLegalBasisFilteredBySensitivity(legalBase, sensitivityLevel)
        )
        .map((legalBasis: ILegalBasisFormValues, index: number) => (
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
                  variant="tertiary"
                  size="small"
                  onClick={() => {
                    onEdit(
                      legalBases?.findIndex(
                        (legalBase: ILegalBasisFormValues) => legalBase.key === legalBasis.key
                      )
                    )
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  size="small"
                  onClick={() => {
                    onRemove(
                      legalBases?.findIndex(
                        (legalBase: ILegalBasisFormValues) => legalBase.key === legalBasis.key
                      )
                    )
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            )}
            sublist
            key={index}
          >
            <ParagraphMedium
              $style={{ marginTop: theme.sizing.scale100, marginBottom: theme.sizing.scale100 }}
            >
              <LegalBasisView legalBasisForm={legalBasis} />
            </ParagraphMedium>
          </ListItem>
        ))}
    </Fragment>
  )
}

interface IListLegalBasesInTableProps {
  legalBases: ILegalBasis[]
}

export const ListLegalBasesInTable = (props: IListLegalBasesInTableProps) => {
  const { legalBases } = props

  return (
    <div>
      <ul style={{ listStyle: 'none', paddingInlineStart: 0, marginTop: 0, marginBottom: 0 }}>
        {legalBases.map((legalBasis: ILegalBasis, index: number) => (
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
