import { Tooltip } from '@navikt/ds-react'
import { ProgressBar } from 'baseui/progress-bar'
import { isNil, sum, uniqBy } from 'lodash'
import { useEffect, useState } from 'react'
import { getResourceById } from '../../../api/GetAllApi'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import {
  EObjectType,
  EProcessStatus,
  IDisclosure,
  IDpia,
  ILegalBasis,
  IProcess,
  IProcessor,
} from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'
import { theme } from '../../../util'
import { env } from '../../../util/env'
import {
  checkForAaregDispatcher,
  getNoDpiaLabel,
  shortenLinksInText,
} from '../../../util/helper-functions'
import DataText from '../../common/DataText'
import { DotTag, DotTags } from '../../common/DotTag'
import { ActiveIndicator } from '../../common/Durations'
import { LegalBasisView } from '../../common/LegalBasis'
import { boolToText } from '../../common/Radio'
import RouteLink, { ObjectLink } from '../../common/RouteLink'
import { TeamList } from '../../common/Team'
import { RetentionView } from '../Retention'

const showDpiaRequiredField = (dpia?: IDpia) => {
  if (dpia?.needForDpia === true) {
    if (dpia.refToDpia) {
      return (
        <>
          {'Ja. Referanse: '}
          {shortenLinksInText(dpia.refToDpia)}
        </>
      )
    } else {
      return 'Ja'
    }
  } else if (dpia?.needForDpia === false) {
    if (dpia) {
      return (
        <>
          {'Nei. Begrunnelse: '}
          <DotTags
            items={dpia.noDpiaReasons.map((r) => {
              return r === 'OTHER' && dpia?.grounds
                ? `${getNoDpiaLabel(r)} (${dpia.grounds})`
                : getNoDpiaLabel(r)
            })}
          />
        </>
      )
    }
  } else {
    return 'Uavklart'
  }
}

export const processStatusText = (status: EProcessStatus | undefined) => {
  switch (status) {
    case EProcessStatus.COMPLETED:
      return 'Ferdig dokumentert'
    case EProcessStatus.NEEDS_REVISION:
      return 'Trenger revidering'
    case EProcessStatus.IN_PROGRESS:
    default:
      return 'Under arbeid'
  }
}

interface IProcessDataProps {
  process: IProcess
  disclosures: IDisclosure[]
}

const ProcessData = (props: IProcessDataProps) => {
  const { process, disclosures } = props
  const [riskOwnerFullName, setRiskOwnerFullName] = useState<string>()
  const [processors, setProcessors] = useState<IProcessor[]>([])

  useEffect(() => {
    ;(async () => {
      if (!env.disableRiskOwner && process.dpia?.riskOwner) {
        setRiskOwnerFullName((await getResourceById(process.dpia.riskOwner)).fullName)
      } else {
        setRiskOwnerFullName('')
      }
    })()
  }, [process])

  useEffect(() => {
    ;(async () => {
      if (process.dataProcessing.processors?.length) {
        const result = await getProcessorsByIds(process.dataProcessing.processors)
        setProcessors([...result])
      }
    })()
  }, [])

  const subjectCategoriesSummarised = uniqBy(
    process.policies.flatMap((policy) => policy.subjectCategories),
    'code'
  )

  return (
    <div>
      <DataText label="Behandlingsnummer" text={'B' + process.number} />

      <DataText label="Formål med behandlingen" text={process.description} />

      {process.additionalDescription && (
        <DataText label="Ytterligere beskrivelse" text="">
          {shortenLinksInText(process.additionalDescription)}
        </DataText>
      )}

      {process.legalBases.length ? (
        <DataText label="Behandlingsgrunnlag for hele behandlingen" text={''}>
          {process.legalBases
            .sort((a, b) =>
              codelist
                .getShortname(EListName.GDPR_ARTICLE, a.gdpr.code)
                .localeCompare(codelist.getShortname(EListName.GDPR_ARTICLE, b.gdpr.code))
            )
            .map((legalBasis: ILegalBasis, index: number) => (
              <div key={index}>
                <LegalBasisView legalBasis={legalBasis} />
              </div>
            ))}
        </DataText>
      ) : (
        <>
          <DataText label="Behandlingsgrunnlag for hele behandlingen" />
        </>
      )}

      <DataText label="Er behandlingen innført i NAV?" text={''}>
        {process.dpia?.processImplemented ? 'Ja' : 'Nei'}
      </DataText>

      {!env.disableRiskOwner && (
        <DataText label="Risikoeier">
          <>
            <span>{process.dpia?.riskOwner ? riskOwnerFullName : 'Ikke utfylt'}</span>
            {!!process.dpia?.riskOwnerFunction && (
              <span> i funksjon {process.dpia.riskOwnerFunction}</span>
            )}
          </>
        </DataText>
      )}

      <DataText label="Gyldighetsperiode for behandlingen" text={''}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText
        label="Personkategorier oppsummert"
        text={
          !subjectCategoriesSummarised.length && !process.usesAllInformationTypes
            ? 'Ikke utfylt'
            : ''
        }
      >
        {process.usesAllInformationTypes
          ? 'Bruker potensielt alle personkategorier'
          : !!subjectCategoriesSummarised.length && (
              <DotTags list={EListName.SUBJECT_CATEGORY} codes={subjectCategoriesSummarised} />
            )}
      </DataText>

      <DataText label="Organisering" text={''}>
        {process.affiliation.department && (
          <div>
            <span>Avdeling: </span>
            <span>
              <DotTags
                list={EListName.DEPARTMENT}
                codes={[process.affiliation.department]}
                commaSeparator
                linkCodelist
              />{' '}
            </span>
          </div>
        )}
        {!process.affiliation.department && <span>Avdeling: Ikke utfylt</span>}
        {!!process.affiliation.subDepartments.length && (
          <div>
            <div className="flex">
              <span>Linja: </span>
              <DotTags
                list={EListName.SUB_DEPARTMENT}
                codes={process.affiliation.subDepartments}
                linkCodelist
              />
            </div>
          </div>
        )}

        <div className="flex">
          <span>Team: </span>
          {process.affiliation.productTeams?.length ? (
            <TeamList teamIds={process.affiliation.productTeams} />
          ) : (
            'Ikke utfylt'
          )}
        </div>

        <div>
          <span>Felles behandlingsansvarlig: </span>
          <span>
            {process.commonExternalProcessResponsible ? (
              <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible.code}`}>
                {codelist.getShortnameForCode(process.commonExternalProcessResponsible)}
              </RouteLink>
            ) : (
              'Nei'
            )}
          </span>
        </div>
      </DataText>

      <DataText label="System" text={''}>
        <DotTags list={EListName.SYSTEM} codes={process.affiliation.products} linkCodelist />
      </DataText>

      <DataText label="Automatisering og profilering" text={''}>
        <div>
          <span>Helautomatisk behandling: </span>
          <span>{boolToText(process.automaticProcessing)}</span>
        </div>
        <div>
          <span>Profilering: </span>
          <span>{boolToText(process.profiling)}</span>
        </div>
      </DataText>

      <DataText label="Databehandler" text={''}>
        <>
          {process.dataProcessing?.dataProcessor === null && 'Uavklart om databehandler benyttes'}
          {process.dataProcessing?.dataProcessor === false && 'Databehandler benyttes ikke'}
        </>
        <>
          {process.dataProcessing?.dataProcessor && (
            <div>
              <div>Databehandler benyttes</div>
              <div>
                {processors && (
                  <div className="flex items-center">
                    <div className="whitespace-nowrap mt-4 mr-0"></div>
                    <div className="flex flex-wrap">
                      {processors.map((processor: IProcessor, index: number) => (
                        <div
                          key={processor.id}
                          className={index < processors.length ? 'mr-1.5' : ''}
                        >
                          <DotTag key={processor.id}>
                            <RouteLink href={'/processor/' + processor.id}>
                              {processor.name}
                            </RouteLink>
                          </DotTag>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      </DataText>

      <DataText label="Lagringsbehov" text={''}>
        <>
          {process.retention?.retentionPlan === null &&
            'Uavklart om omfattes av NAVs bevarings- og kassasjonsvedtak'}
          {process.retention?.retentionPlan === false &&
            'Omfattes ikke av NAVs bevarings- og kassasjonsvedtak'}
        </>
        <>
          {process.retention?.retentionPlan && (
            <div>
              <div>Omfattes av NAVs bevarings- og kassasjonsvedtak</div>
            </div>
          )}
          <div>
            <RetentionView retention={process.retention} />
          </div>
          <div>
            <span>{process.retention?.retentionDescription && 'Begrunnelse: '}</span>
            {process.retention?.retentionDescription &&
              shortenLinksInText(process.retention?.retentionDescription)}
          </div>
        </>
      </DataText>

      <DataText label="Er det behov for PVK?" text={''}>
        <div>
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </div>
      </DataText>

      {process.affiliation.disclosureDispatchers.length !== 0 && (
        <DataText label="Avsender" text={''}>
          <DotTags list={EListName.SYSTEM} codes={process.affiliation.disclosureDispatchers} />
        </DataText>
      )}

      {(disclosures.length !== 0 || checkForAaregDispatcher(process)) && (
        <DataText label="Utleveringer" text={''}>
          <div>
            {checkForAaregDispatcher(process) ? (
              <>
                <RouteLink href={'/disclosure?process=' + process.id}>
                  Lenke til side for utleveringer
                </RouteLink>
              </>
            ) : (
              disclosures.map((value: IDisclosure) => (
                <>
                  <ObjectLink id={value.id} type={EObjectType.DISCLOSURE}>
                    {value.recipient.shortName}: {value.name}
                  </ObjectLink>
                  &nbsp;
                </>
              ))
            )}
          </div>
        </DataText>
      )}
      <Completeness process={process} />

      <DataText label="Status" text={''}>
        {processStatusText(process.status)}
        {process.revisionText && `: ${process.revisionText}`}
      </DataText>
    </div>
  )
}

interface ICompletenessProps {
  process: IProcess
}

const Completeness = (props: ICompletenessProps) => {
  const { process } = props
  const completeness = {
    dpia: !isNil(process.dpia?.needForDpia),
    dpiaReference: !process.dpia?.needForDpia || !isNil(process.dpia?.refToDpia),
    profiling: !isNil(process.profiling),
    automation: !isNil(process.automaticProcessing),
    retention: !isNil(process.retention?.retentionPlan),
    retentionTime:
      !process.retention?.retentionPlan ||
      (!!process.retention.retentionStart && !!process.retention.retentionMonths),
    dataProcessor: !isNil(process.dataProcessing?.dataProcessor),
    dataProcessors:
      !process.dataProcessing?.dataProcessor || !!process.dataProcessing?.processors.length,
    policies: process.usesAllInformationTypes || !!process.policies.length,
    completed: process.status === EProcessStatus.COMPLETED,
  }
  const completed: number = sum(
    Object.keys(completeness).map((k) => ((completeness as any)[k] ? 1 : 0))
  )
  const completables: number = Object.keys(completeness).length
  const color = () => {
    const perc = completed / completables
    if (perc < 0.3) return theme.colors.negative400
    if (perc === 1) return theme.colors.positive400
    return theme.colors.warning400
  }

  const barOverrides = {
    BarProgress: { style: { backgroundColor: color() } },
    Bar: { style: { marginLeft: 0, marginRight: 0 } },
  }

  const getContent = () => {
    let content = ''
    content += completed === completables ? 'Godkjent' : 'Ikke utfylt: '
    if (!completeness.dpia) content += 'Behov for PVK, '
    if (!completeness.dpiaReference) content += 'Ref. til PVK, '
    if (!completeness.profiling) content += 'Profilering, '
    if (!completeness.automation) content += 'Automatisering og profilering, '
    if (!completeness.retention) content += 'Lagringsbehov, '
    if (!completeness.retentionTime) content += 'Lagringsbehov for NAV, '
    if (!completeness.dataProcessor) content += 'Databehandler, '
    if (!completeness.dataProcessors) content += 'Ref. til databehandleravtale, '
    if (!completeness.policies) content += 'Opplysningstyper, '
    if (!completeness.completed) content += 'Status på utfylling'
    return content
  }

  return (
    <DataText label="Kompletthet" text={''}>
      <Tooltip content={getContent()}>
        <div className="flex h-6 items-center cursor-help">
          <ProgressBar value={completed} successValue={completables} overrides={barOverrides} />
        </div>
      </Tooltip>
    </DataText>
  )
}

export default ProcessData
