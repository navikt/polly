import queryString from 'query-string'
import {
  convertDisclosureToFormValues,
  getDisclosuresByProcessId,
  updateDisclosure,
} from '@/api/DisclosureApi'
import {
  createPolicies,
  createPolicy,
  deletePoliciesByProcessId,
  deletePolicy,
  updatePolicy,
} from '@/api/PolicyApi'
import { deleteProcess, updateProcess } from '@/api/ProcessApi'
import { ESection } from '@/components/mainPages/ProcessPage'
import {
  ELegalBasesUse,
  EProcessStatus,
  IAddDocumentToProcessFormValues,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessFormValues,
  IProcessShort,
} from '@/constants'
import { generatePath } from './router'

export const processPath = '/process/:section/:code/:processId'
export const processPathNoId = '/process/:section/:code/'

export const sortProcess = (list: IProcessShort[]) =>
  list.sort((p1, p2) => p1.name.localeCompare(p2.name, 'nb'))

export const handleDeleteProcess = async (
  processToDelete: IProcess,
  processList: IProcessShort[],
  setProcessList: (value: IProcessShort[]) => void,
  setErrorProcessModal: (value: string) => void
): Promise<boolean> => {
  try {
    await deleteProcess(processToDelete.id)
    setProcessList(
      sortProcess(processList.filter((process: IProcessShort) => process.id !== processToDelete.id))
    )
    setErrorProcessModal('')
    return true
  } catch (error: any) {
    if (error.response.data.message.includes('disclosure(s)')) {
      setErrorProcessModal('Du kan ikke slette behandlinger med eksisterende utleveringer.')
      return false
    }
    setErrorProcessModal(error.response.data.message)
    return false
  }
}

export const handleEditProcess = async (
  values: IProcessFormValues,
  setCurrentProcess: (value: IProcess) => void,
  processList: IProcessShort[],
  setProcessList: (value: IProcessShort[]) => void
): Promise<boolean> => {
  try {
    const updatedProcess = await updateProcess(values)
    const disclosures = await getDisclosuresByProcessId(updatedProcess.id)
    const removedDisclosures = disclosures.filter(
      (disclosure) => !values.disclosures.map((value) => value.id).includes(disclosure.id)
    )
    const addedDisclosures = values.disclosures.filter(
      (disclosure) => !disclosures.map((value) => value.id).includes(disclosure.id)
    )
    removedDisclosures.forEach((disclosure) =>
      updateDisclosure(
        convertDisclosureToFormValues({
          ...disclosure,
          processIds: [...disclosure.processIds.filter((process) => process !== updatedProcess.id)],
        })
      )
    )
    addedDisclosures.forEach((disclosure) =>
      updateDisclosure(
        convertDisclosureToFormValues({
          ...disclosure,
          processIds: [...disclosure.processIds, updatedProcess.id],
        })
      )
    )
    setCurrentProcess(updatedProcess)
    setProcessList(
      sortProcess([
        ...processList.filter((process) => process.id !== updatedProcess.id),
        updatedProcess,
      ])
    )
    return true
  } catch (error: any) {
    console.debug(error)
    return false
  }
}

export const handleCreatePolicy = async (
  values: IPolicyFormValues,
  currentProcess: IProcess | undefined,
  getProcessById: (id: string) => Promise<void>,
  setErrorPolicyModal: (value: string | null) => void
): Promise<boolean> => {
  if (!values || !currentProcess) return false

  try {
    const policy: IPolicy = await createPolicy(values)
    await getProcessById(policy.process.id)
    setErrorPolicyModal(null)
    return true
  } catch (error: any) {
    setErrorPolicyModal(error.message)
    return false
  }
}

export const handleEditPolicy = async (
  values: IPolicyFormValues,
  currentProcess: IProcess | undefined,
  setCurrentProcess: (value: IProcess) => void,
  setErrorPolicyModal: (value: string | null) => void
) => {
  try {
    const updatedPolicy: IPolicy = await updatePolicy(values)
    if (currentProcess) {
      setCurrentProcess({
        ...currentProcess,
        policies: [
          ...currentProcess.policies.filter((policy: IPolicy) => policy.id !== updatedPolicy.id),
          updatedPolicy,
        ],
      })
      setErrorPolicyModal(null)
    }
    return true
  } catch (error: any) {
    setErrorPolicyModal(error.message)
    return false
  }
}

export const handleDeletePolicy = async (
  policyToDelete: IPolicy,
  currentProcess: IProcess | undefined,
  setCurrentProcess: (value: IProcess) => void,
  setErrorPolicyModal: (value: string | null) => void
): Promise<boolean> => {
  if (!policyToDelete) return false
  try {
    await deletePolicy(policyToDelete.id)
    if (currentProcess) {
      setCurrentProcess({
        ...currentProcess,
        policies: [
          ...currentProcess.policies.filter((policy: IPolicy) => policy.id !== policyToDelete.id),
        ],
      })
      setErrorPolicyModal(null)
    }
    return true
  } catch (error: any) {
    setErrorPolicyModal(error.message)
    return false
  }
}

export const handleDeleteAllPolicies = async (
  processId: string,
  currentProcess: IProcess | undefined,
  setCurrentProcess: (value: IProcess) => void,
  setErrorPolicyModal: (value: string | null) => void
): Promise<boolean> => {
  if (!processId) return false
  try {
    await deletePoliciesByProcessId(processId)
    if (currentProcess) {
      setCurrentProcess({ ...currentProcess, policies: [] })
      setErrorPolicyModal(null)
    }
    return true
  } catch (error: any) {
    setErrorPolicyModal(error.message)
    return false
  }
}

export const handleAddDocument = async (
  formValues: IAddDocumentToProcessFormValues,
  getProcessById: (id: string) => Promise<void>,
  setErrorDocumentModal: (value: string | null) => void
): Promise<boolean> => {
  try {
    const policies: IPolicyFormValues[] = formValues.informationTypes.map((infoType) => ({
      subjectCategories: infoType.subjectCategories.map((category) => category.code),
      informationType: infoType.informationType,
      process: { ...formValues.process, legalBases: [] },
      purposes: formValues.process.purposes.map((purpose) => purpose.code),
      legalBases: [],
      legalBasesOpen: false,
      legalBasesUse: ELegalBasesUse.INHERITED_FROM_PROCESS,
      documentIds: !formValues.linkDocumentToPolicies
        ? []
        : [formValues.document ? formValues.document.id : ''],
      otherPolicies: [],
    }))
    await createPolicies(policies)
    await getProcessById(formValues.process.id)
  } catch (error: any) {
    setErrorDocumentModal(error.message)
    return false
  }
  return true
}

export const genProcessPath = (
  section: ESection,
  code: string,
  process?: Partial<IProcess>,
  filter?: EProcessStatus,
  create?: boolean
) => {
  if (process && process.id) {
    return (
      generatePath(processPath, {
        section,
        // todo multipurpose url
        code: section === ESection.purpose && !!process?.purposes ? process.purposes[0].code : code,
        processId: process.id,
      }) +
      '?' +
      queryString.stringify({ filter, create }, { skipNull: true, skipEmptyString: true })
    )
  }

  return (
    generatePath(processPathNoId, {
      section,
      // todo multipurpose url
      code: section === ESection.purpose && !!process?.purposes ? process.purposes[0].code : code,
    }) +
    '?' +
    queryString.stringify({ filter, create }, { skipNull: true, skipEmptyString: true })
  )
}

export const genUnderordnetProcessPath = (
  section: ESection,
  code: string,
  overordnetBehandling: IProcess,
  underordnetBehandling?: Partial<IProcess>,
  underordnetfilter?: EProcessStatus,
  create?: boolean
) => {
  if (underordnetBehandling && underordnetBehandling.id) {
    return (
      generatePath(processPath, {
        section,
        // todo multipurpose url
        code: code,
        processId: overordnetBehandling.id,
      }) +
      '?' +
      queryString.stringify(
        { underordnetBehandlingId: underordnetBehandling.id, underordnetfilter, create },
        { skipNull: true, skipEmptyString: true }
      )
    )
  }

  return (
    generatePath(processPath, {
      section,
      code: code,
      processId: overordnetBehandling.id,
    }) +
    '?' +
    queryString.stringify(
      { underordnetBehandlingId: '', underordnetfilter, create },
      { skipNull: true, skipEmptyString: true }
    )
  )
}
