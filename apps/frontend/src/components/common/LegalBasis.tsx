import { faCircleExclamation, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyLong, Button, Link, Tooltip } from '@navikt/ds-react'
import { Fragment, JSX } from 'react/jsx-runtime'
import { ILegalBasis, ILegalBasisFormValues, IPolicyAlert } from '../../constants'
import { EListName, ESensitivityLevel, ICodelistProps } from '../../service/Codelist'
import { theme } from '../../util'
import { env } from '../../util/env'
import { processString } from '../../util/string-processor'

interface ILegalBasisViewProps {
  legalBasis?: ILegalBasis
  legalBasisForm?: ILegalBasisFormValues
  codelistUtils: ICodelistProps
}

export const LegalBasisView = (props: ILegalBasisViewProps) => {
  const { legalBasis, legalBasisForm, codelistUtils } = props
  const input = legalBasis ? legalBasis : legalBasisForm
  if (!input) return null
  const { description } = input
  const islegalBasis = legalBasisForm && legalBasisForm.gdpr
  const gdpr = legalBasis ? legalBasis.gdpr.code : islegalBasis
  const nationalLaw =
    legalBasis && legalBasis.nationalLaw
      ? legalBasis.nationalLaw.code
      : legalBasisForm && legalBasisForm.nationalLaw
        ? legalBasisForm.nationalLaw
        : ''

  const gdprDisplay: string | undefined =
    gdpr && codelistUtils.getShortname(EListName.GDPR_ARTICLE, gdpr)
  const nationalLawDisplay: string | undefined =
    nationalLaw && codelistUtils.getShortname(EListName.NATIONAL_LAW, nationalLaw)

  const descriptionText: string | JSX.Element[] | undefined = codelistUtils.valid(
    EListName.NATIONAL_LAW,
    nationalLaw
  )
    ? legalBasisLinkProcessor(codelistUtils, nationalLaw, description)
    : description

  return (
    <span>
      {gdprDisplay}
      {(nationalLawDisplay || descriptionText) && ', '} {nationalLawDisplay} {descriptionText}
    </span>
  )
}

const lovdataBase = (codelistUtils: ICodelistProps, nationalLaw: string): string => {
  return (
    (codelistUtils.isForskrift(nationalLaw) ? env.lovdataForskriftBaseUrl : env.lovdataLovBaseUrl) +
    codelistUtils.getDescription(EListName.NATIONAL_LAW, nationalLaw)
  )
}

const legalBasisLinkProcessor = (codelistUtils: ICodelistProps, law: string, text?: string) => {
  const lawCode: string = codelistUtils.getDescription(EListName.NATIONAL_LAW, law)
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
        <Link
          key={key}
          href={`${lovdataBase(codelistUtils, law)}/§${result[3]}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!result[1] && !result[2] && '§'} {result[2] && '§§'} {result[3]}
        </Link>
      ),
    },
    {
      regex: /kap(ittel)?\s*(\d+)/gi,
      fn: (key: string, result: string[]) => (
        <Link
          key={key}
          href={`${lovdataBase(codelistUtils, law)}/KAPITTEL_${result[2]}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Kapittel {result[2]}
        </Link>
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
  codelistUtils: ICodelistProps,
  sensitivityLevel?: ESensitivityLevel
) => {
  return (
    (sensitivityLevel === ESensitivityLevel.ART6 && codelistUtils.isArt6(legalBasis.gdpr)) ||
    (sensitivityLevel === ESensitivityLevel.ART9 && codelistUtils.isArt9(legalBasis.gdpr)) ||
    !sensitivityLevel
  )
}

interface IListLegalBasesProps {
  legalBases?: ILegalBasisFormValues[]
  onRemove: (index: number) => void
  onEdit: (index: number) => void
  sensitivityLevel?: ESensitivityLevel.ART6 | ESensitivityLevel.ART9
  codelistUtils: ICodelistProps
}

export const ListLegalBases = (props: IListLegalBasesProps) => {
  const { legalBases, onRemove, onEdit, sensitivityLevel, codelistUtils } = props

  if (!legalBases) return null

  return (
    <Fragment>
      {legalBases
        .filter((legalBase: ILegalBasisFormValues) =>
          isLegalBasisFilteredBySensitivity(legalBase, codelistUtils, sensitivityLevel)
        )
        .map((legalBasis: ILegalBasisFormValues, index: number) => (
          <div
            key={index}
            className="flex items-start justify-between gap-2"
            style={{ marginTop: theme.sizing.scale100, marginBottom: theme.sizing.scale100 }}
          >
            <BodyLong size="small">
              <LegalBasisView legalBasisForm={legalBasis} codelistUtils={codelistUtils} />
            </BodyLong>
            <div className="flex shrink-0">
              <Button
                type="button"
                variant="tertiary"
                size="small"
                aria-label="Rediger behandlingsgrunnlag"
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
                aria-label="Slett behandlingsgrunnlag"
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
          </div>
        ))}
    </Fragment>
  )
}

interface IListLegalBasesInTableProps {
  legalBases: ILegalBasis[]
  codelistUtils: ICodelistProps
}

export const ListLegalBasesInTable = (props: IListLegalBasesInTableProps) => {
  const { legalBases, codelistUtils } = props

  return (
    <div>
      <ul style={{ listStyle: 'none', paddingInlineStart: 0, marginTop: 0, marginBottom: 0 }}>
        {legalBases.map((legalBasis: ILegalBasis, index: number) => (
          <div className="mb-2" key={index}>
            <li>
              <LegalBasisView legalBasis={legalBasis} codelistUtils={codelistUtils} />
            </li>
          </div>
        ))}
      </ul>
    </div>
  )
}
