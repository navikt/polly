import { BodyLong, ProgressBar, Tooltip } from '@navikt/ds-react'
import { isNil, sum, uniqBy } from 'lodash'
import { Fragment, useEffect, useState } from 'react'
import { getResourceById } from '../../../api/GetAllApi'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import {
  EObjectType,
  EProcessStatus,
  IDisclosure,
  IDpia,
  ILegalBasis,
  INomData,
  INomSeksjon,
  IProcess,
  IProcessor,
} from '../../../constants'
import { CodelistService, EListName, ICodelistProps } from '../../../service/Codelist'
import { env } from '../../../util/env'
import {
  checkForAaregDispatcher,
  getNoDpiaLabel,
  shortenLinksInText,
} from '../../../util/helper-functions'
import DataText from '../../common/DataText'
import { DotTags } from '../../common/DotTag'
import { ActiveIndicator } from '../../common/Durations'
import { LegalBasisView } from '../../common/LegalBasis'
import { boolToText } from '../../common/Radio'
import RouteLink, { ObjectLink } from '../../common/RouteLink'
import { TeamList } from '../../common/Team'
import StartEndDateView from '../AiUsageDescription/StartEndDateView'
import { RetentionView } from '../Retention'

const showDpiaRequiredField = (dpia?: IDpia) => {
  const [codelistUtils] = CodelistService()

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
            codelistUtils={codelistUtils}
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
  codelistUtils: ICodelistProps
}

const ProcessData = (props: IProcessDataProps) => {
  const { process, disclosures, codelistUtils } = props

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
              codelistUtils
                .getShortname(EListName.GDPR_ARTICLE, a.gdpr.code)
                .localeCompare(codelistUtils.getShortname(EListName.GDPR_ARTICLE, b.gdpr.code))
            )
            .map((legalBasis: ILegalBasis, index: number) => (
              <div key={index}>
                <LegalBasisView legalBasis={legalBasis} codelistUtils={codelistUtils} />
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
              <ul className="mt-0 list-disc list-inside">
                {subjectCategoriesSummarised.map((subjectCategory, index: number) => (
                  <li key={`${subjectCategory.code}-${index}`}>
                    {codelistUtils.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)}
                  </li>
                ))}
              </ul>
            )}
      </DataText>

      <DataText label="Organisering" text={''}>
        {process.affiliation.nomDepartmentName && process.affiliation.nomDepartmentId && (
          <div className="mt-2">
            <span>Avdeling:</span>
            <ul className="mt-0 list-disc list-inside">
              <li>
                <ObjectLink id={process.affiliation.nomDepartmentId} type={EListName.DEPARTMENT}>
                  {process.affiliation.nomDepartmentName}
                </ObjectLink>
              </li>
            </ul>
          </div>
        )}
        {process.affiliation.seksjoner.length !== 0 && (
          <div>
            <span>Seksjon: </span>
            <span>
              <div className="inline">
                {process.affiliation.seksjoner.map((seksjon: INomSeksjon, index) => (
                  <Fragment key={seksjon.nomSeksjonId}>
                    <>{seksjon.nomSeksjonName}</>
                    <span>{index < process.affiliation.seksjoner.length - 1 ? ', ' : ''}</span>
                  </Fragment>
                ))}
              </div>
            </span>
          </div>
        )}
        {!process.affiliation.nomDepartmentName && !process.affiliation.nomDepartmentId && (
          <span>Avdeling: Ikke utfylt</span>
        )}
        {!!process.affiliation.subDepartments.length && (
          <div>
            <div className="flex">
              <span>Linja: </span>
              <DotTags
                list={EListName.SUB_DEPARTMENT}
                codes={process.affiliation.subDepartments}
                linkCodelist
                codelistUtils={codelistUtils}
              />
            </div>

            {process.affiliation.subDepartments.filter((subdep) => subdep.code === 'NAVFYLKE')
              .length !== 0 &&
              process.affiliation.fylker.length !== 0 && (
                <div className="flex gap-1">
                  <span>Fylke: </span>
                  <span>
                    <div className="inline">
                      {process.affiliation.fylker.map((fylke: INomData, index) => (
                        <Fragment key={fylke.nomId}>
                          <>{fylke.nomName}</>
                          <span>{index < process.affiliation.fylker.length - 1 ? ', ' : ''}</span>
                        </Fragment>
                      ))}
                    </div>
                  </span>
                </div>
              )}

            {process.affiliation.subDepartments.filter((subdep) => subdep.code === 'NAVKONTORSTAT')
              .length !== 0 &&
              process.affiliation.navKontorer.length !== 0 && (
                <div className="flex gap-1">
                  <span>Nav-kontor: </span>
                  <span>
                    <div className="inline">
                      {process.affiliation.navKontorer.map((kontor: INomData, index) => (
                        <Fragment key={kontor.nomId}>
                          <>{kontor.nomName}</>
                          <span>
                            {index < process.affiliation.navKontorer.length - 1 ? ', ' : ''}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </span>
                </div>
              )}
          </div>
        )}

        <div className="mt-2">
          <span>Team:</span>
          {process.affiliation.productTeams?.length ? (
            <TeamList teamIds={process.affiliation.productTeams} variant="list" />
          ) : (
            'Ikke utfylt'
          )}
        </div>

        <div className="mt-2">
          <span>Felles behandlingsansvarlig: </span>
          <span>
            {process.commonExternalProcessResponsible ? (
              <RouteLink href={`/thirdparty/${process.commonExternalProcessResponsible.code}`}>
                {codelistUtils.getShortnameForCode(process.commonExternalProcessResponsible)}
              </RouteLink>
            ) : (
              'Nei'
            )}
          </span>
        </div>
      </DataText>

      <DataText label="System" text={''}>
        {process.affiliation.products?.length ? (
          <ul className="mt-0 list-disc list-inside">
            {process.affiliation.products.map((system, index: number) => (
              <li key={`${system.code}-${index}`}>
                <ObjectLink id={system.code} type={EListName.SYSTEM}>
                  {codelistUtils.getShortname(EListName.SYSTEM, system.code)}
                </ObjectLink>
              </li>
            ))}
          </ul>
        ) : (
          'Ikke utfylt'
        )}
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

      <DataText label="Kunstig intelligens" text={''}>
        <div>
          <span>KI-systemer benyttes: </span>
          <span>{boolToText(process.aiUsageDescription.aiUsage)}</span>
        </div>
        {process.aiUsageDescription.aiUsage && (
          <div>
            <BodyLong>Hvilken rolle har KI-systemet? </BodyLong>
            <BodyLong>{process.aiUsageDescription.description}</BodyLong>
          </div>
        )}
        <div>
          <span>Personopplysninger gjenbrukes til å utvikle KI-systemer: </span>
          <span>{boolToText(process.aiUsageDescription.reusingPersonalInformation)}</span>
        </div>
        {(process.aiUsageDescription.aiUsage ||
          process.aiUsageDescription.reusingPersonalInformation) && (
          <div>
            <span>Dato for bruk av KI-systemer: </span>
            <StartEndDateView aiUsageDescription={process.aiUsageDescription} />
          </div>
        )}
        {process.aiUsageDescription.reusingPersonalInformation && (
          <div>
            <BodyLong>Registreringsnummer i modellregister: </BodyLong>
            <BodyLong>{process.aiUsageDescription.registryNumber}</BodyLong>
          </div>
        )}
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
                  <ul className="mt-0 list-disc list-inside">
                    {processors.map((processor: IProcessor, index: number) => (
                      <li key={`${processor.id}-${index}`}>
                        <RouteLink href={'/processor/' + processor.id}>{processor.name}</RouteLink>
                      </li>
                    ))}
                  </ul>
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
        <div className="break-words">
          <span>{showDpiaRequiredField(process.dpia)}</span>
        </div>
      </DataText>

      {process.affiliation.disclosureDispatchers.length !== 0 && (
        <DataText label="Avsender" text={''}>
          <ul className="mt-0 list-disc list-inside">
            {process.affiliation.disclosureDispatchers.map((dispatcher, index) => (
              <li key={`${dispatcher.code}-${index}`}>
                <ObjectLink id={dispatcher.code} type={EListName.SYSTEM}>
                  {codelistUtils.getShortname(EListName.SYSTEM, dispatcher.code)}
                </ObjectLink>
              </li>
            ))}
          </ul>
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
              <ul className="list-disc pl-5">
                {disclosures.map((value: IDisclosure) => (
                  <li key={value.id}>
                    <ObjectLink id={value.id} type={EObjectType.DISCLOSURE}>
                      {value.recipient.shortName}: {value.name}
                    </ObjectLink>
                  </li>
                ))}
              </ul>
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

  const colorRole = () => {
    const perc = completed / completables
    if (perc < 0.3) return 'danger'
    if (perc === 1) return 'success'
    return 'warning'
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
        <div className="flex h-6 w-full items-center cursor-help">
          <ProgressBar
            aria-label="Kompletthet"
            className="flex-1"
            value={completed}
            valueMax={completables}
            data-color={colorRole()}
            size="small"
          />
        </div>
      </Tooltip>
    </DataText>
  )
}

export default ProcessData
