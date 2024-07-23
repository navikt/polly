import { Disclosure, Dpia, ObjectType, Process, Processor, ProcessStatus } from '../../../constants'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getResourceById } from '../../../api'
import { codelist, ListName } from '../../../service/Codelist'
import { Block } from 'baseui/block'
import { theme } from '../../../util'
import { LegalBasisView } from '../../common/LegalBasis'
import { ActiveIndicator } from '../../common/Durations'
import { DotTag, DotTags } from '../../common/DotTag'
import { TeamList } from '../../common/Team'
import { boolToText } from '../../common/Radio'
import { RetentionView } from '../Retention'
import { env } from '../../../util/env'
import { isNil, sum, uniqBy } from 'lodash'
import { ProgressBar } from 'baseui/progress-bar'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import RouteLink, { ObjectLink } from '../../common/RouteLink'
import DataText from '../../common/DataText'
import { checkForAaregDispatcher, getNoDpiaLabel, shortenLinksInText } from '../../../util/helper-functions'
import { getProcessorsByIds } from '../../../api/ProcessorApi'

const showDpiaRequiredField = (dpia?: Dpia) => {
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
              return r === 'OTHER' && dpia?.grounds ? `${getNoDpiaLabel(r)} (${dpia.grounds})` : getNoDpiaLabel(r)
            })}
          />
        </>
      )
    }
  } else {
    return 'Uavklart'
  }
}

export const processStatusText = (status: ProcessStatus | undefined) => {
  switch (status) {
    case ProcessStatus.COMPLETED:
      return 'Ferdig dokumentert'
    case ProcessStatus.NEEDS_REVISION:
      return 'Trenger revidering'
    case ProcessStatus.IN_PROGRESS:
    default:
      return 'Under arbeid'
  }
}

const ProcessData = (props: { process: Process; disclosures: Disclosure[] }) => {
  const { process } = props
  const [riskOwnerFullName, setRiskOwnerFullName] = React.useState<string>()
  const [processors, setProcessors] = useState<Processor[]>([])

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
        const res = await getProcessorsByIds(process.dataProcessing.processors)
        setProcessors([...res])
      }
    })()
  }, [])

  const subjectCategoriesSummarised = uniqBy(
    process.policies.flatMap((p) => p.subjectCategories),
    'code',
  )

  return (
    <div>
      <DataText label='Behandlingsnummer'text={'B' + process.number} />

      <DataText label='Formål med behandlingen' text={process.description} />

      {process.additionalDescription && (
        <DataText label='Ytterligere beskrivelse' text="">
          {shortenLinksInText(process.additionalDescription)}
        </DataText>
      )}

      {process.legalBases.length ? (
        <DataText label='Behandlingsgrunnlag for hele behandlingen' text={''}>
          {process.legalBases
            .sort((a, b) => codelist.getShortname(ListName.GDPR_ARTICLE, a.gdpr.code).localeCompare(codelist.getShortname(ListName.GDPR_ARTICLE, b.gdpr.code)))
            .map((legalBasis, index) => (
              <div key={index}>
                <LegalBasisView legalBasis={legalBasis} />
              </div>
            ))}
        </DataText>
      ) : (
        <>
          <DataText label='Behandlingsgrunnlag for hele behandlingen' />
        </>
      )}

      <DataText label='Er behandlingen innført i NAV?' text={''}>
        {process.dpia?.processImplemented ? 'Ja' : 'Nei'}
      </DataText>

      {!env.disableRiskOwner && (
        <DataText label='Risikoeier'>
          <>
            <span>{process.dpia?.riskOwner ? riskOwnerFullName : 'Ikke utfylt'}</span>
            {!!process.dpia?.riskOwnerFunction && (
              <span>
                {' '}
                i funksjon {process.dpia.riskOwnerFunction}
              </span>
            )}
          </>
        </DataText>
      )}

      <DataText label='Gyldighetsperiode for behandlingen' text={''}>
        <ActiveIndicator alwaysShow={true} showDates={true} {...process} />
      </DataText>

      <DataText label='Personkategorier oppsummert' text={!subjectCategoriesSummarised.length && !process.usesAllInformationTypes ? 'Ikke utfylt' : ''}>
        {process.usesAllInformationTypes
          ? 'Bruker potensielt alle personkategorier'
          : !!subjectCategoriesSummarised.length && <DotTags list={ListName.SUBJECT_CATEGORY} codes={subjectCategoriesSummarised} />}
      </DataText>

      <DataText label='Organisering' text={''}>
        {process.affiliation.department ? (
          <div>
            <span>Avdeling: </span>
            <span>
              <DotTags list={ListName.DEPARTMENT} codes={[process.affiliation.department]} commaSeparator linkCodelist />{' '}
            </span>
          </div>
        ) : (
          <span>
            Avdeling: Ikke utfylt
          </span>
        )}
        {!!process.affiliation.subDepartments.length && (
          <div>
            <div className="flex">
              <span>Linja: </span>
              <DotTags list={ListName.SUB_DEPARTMENT} codes={process.affiliation.subDepartments} linkCodelist />
            </div>
          </div>
        )}

        <div className="flex">
          <span>Team: </span>
          {!!process.affiliation.productTeams?.length ? <TeamList teamIds={process.affiliation.productTeams} /> : 'Ikke utfylt'}
        </div>

        <div>
          <span>Felles behandlingsansvarlig: </span>
          <span>
            {!!process.commonExternalProcessResponsible ? (
              <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible.code}`}>{codelist.getShortnameForCode(process.commonExternalProcessResponsible)}</RouteLink>
            ) : (
              'Nei'
            )}
          </span>
        </div>
      </DataText>

      <DataText label='System' text={''}>
        <DotTags list={ListName.SYSTEM} codes={process.affiliation.products} linkCodelist />
      </DataText>

      <DataText label='Automatisering og profilering' text={''}>
        <div>
          <span>Helautomatisk behandling: </span>
          <span>{boolToText(process.automaticProcessing)}</span>
        </div>
        <div>
          <span>Profilering: </span>
          <span>{boolToText(process.profiling)}</span>
        </div>
      </DataText>

      <DataText label='Databehandler' text={''}>
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
                      {processors.map((dp, i) => (
                        <div key={dp.id} className={i < processors.length ? 'mr-1.5' : ''}>
                          <DotTag key={dp.id}>
                            <RouteLink href={'/processor/' + dp.id}>{dp.name}</RouteLink>
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

      <DataText label='Lagringsbehov' text={''}>
        <>
          {process.retention?.retentionPlan === null &&'Uavklart om omfattes av NAVs bevarings- og kassasjonsvedtak'}
          {process.retention?.retentionPlan === false && 'Omfattes ikke av NAVs bevarings- og kassasjonsvedtak'}
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
            {process.retention?.retentionDescription && shortenLinksInText(process.retention?.retentionDescription)}
          </div>
        </>
      </DataText>

      <DataText label='Er det behov for PVK?' text={''}>
        <div>
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </div>
      </DataText>

      {props.process.affiliation.disclosureDispatchers.length !== 0 && (
        <DataText label='Avsender' text={''}>
          <DotTags list={ListName.SYSTEM} codes={process.affiliation.disclosureDispatchers} />
        </DataText>
      )}

      {(props.disclosures.length !== 0 || checkForAaregDispatcher(props.process)) && (
        <DataText label='Utleveringer' text={''}>
          <div>
            {checkForAaregDispatcher(props.process) ? (
              <>
                <RouteLink href={'/disclosure?process=' + props.process.id}>Lenke til side for utleveringer</RouteLink>
              </>
            ) : (
              props.disclosures.map((value) => (
                <>
                  <ObjectLink id={value.id} type={ObjectType.DISCLOSURE}>
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

      <DataText label='Status' text={''}>
        {processStatusText(process.status)}
        {process.revisionText && `: ${process.revisionText}`}
      </DataText>
    </div>
  )
}

const Completeness = (props: { process: Process }) => {
  const { process } = props
  const completeness = {
    dpia: !isNil(process.dpia?.needForDpia),
    dpiaReference: !process.dpia?.needForDpia || !isNil(process.dpia?.refToDpia),
    profiling: !isNil(process.profiling),
    automation: !isNil(process.automaticProcessing),
    retention: !isNil(process.retention?.retentionPlan),
    retentionTime: !process.retention?.retentionPlan || (!!process.retention.retentionStart && !!process.retention.retentionMonths),
    dataProcessor: !isNil(process.dataProcessing?.dataProcessor),
    dataProcessors: !process.dataProcessing?.dataProcessor || !!process.dataProcessing?.processors.length,
    policies: process.usesAllInformationTypes || !!process.policies.length,
    completed: process.status === ProcessStatus.COMPLETED,
  }
  const completed = sum(Object.keys(completeness).map((k) => ((completeness as any)[k] ? 1 : 0)))
  const completables = Object.keys(completeness).length
  const color = () => {
    const perc = completed / completables
    if (perc < 0.3) return theme.colors.negative400
    if (perc === 1) return theme.colors.positive400
    return theme.colors.warning400
  }

  const barOverrides = { BarProgress: { style: { backgroundColor: color() } }, Bar: { style: { marginLeft: 0, marginRight: 0 } } }

  return (
    <DataText label='Kompletthet' text={''}>
      <CustomizedStatefulTooltip
        content={
          <div>
            <p>{completed === completables ? 'Godkjent' : 'Ikke utfylt:'}</p>
            <p>{!completeness.dpia && 'Behov for PVK'}</p>
            <p>{!completeness.dpiaReference && 'Ref. til PVK'}</p>
            <p>{!completeness.profiling && 'Profilering'}</p>
            <p>{!completeness.automation && 'Automatisering og profilering'}</p>
            <p>{!completeness.retention && 'Lagringsbehov'}</p>
            <p>{!completeness.retentionTime && 'Lagringsbehov for NAV'}</p>
            <p>{!completeness.dataProcessor && 'Databehandler'}</p>
            <p>{!completeness.dataProcessors && 'Ref. til databehandleravtale'}</p>
            <p>{!completeness.policies && 'Opplysningstyper'}</p>
            <p>{!completeness.completed && 'Status på utfylling'}</p>
          </div>
        }
      >
        <div className="flex h-6 items-center cursor-help">
          <ProgressBar value={completed} successValue={completables} overrides={barOverrides} />
        </div>
      </CustomizedStatefulTooltip>
    </DataText>
  )
}

export default ProcessData
