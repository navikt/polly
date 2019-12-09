import axios from "axios"
import { PageResponse, Process, ProcessFormValues, ProcessPurposeCount } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getProcess = async (processId: string) => {
    return (await axios.get<Process>(`${server_polly}/process/${processId}`)).data
}

export const getProcessesForPurpose = async (purpose: string) => {
    return (await axios.get<PageResponse<Process>>(`${server_polly}/process/purpose/${purpose}`)).data
}

export const getProcessPurposeCount = async () => {
    return (await axios.get<ProcessPurposeCount>(`${server_polly}/process/count/purpose`)).data
}

export const createProcess = async (process: any) => {
    return (await axios.post<PageResponse<Process>>(`${server_polly}/process`, [process])).data.content[0]
}

export const updateProcess = async (process: ProcessFormValues) => {
    let body = mapProcessFromForm(process)
    return (await axios.put<Process>(`${server_polly}/process/${process.id}`, body)).data
}

export const convertProcessToFormValues = (process: Process) => {
    const {id, purposeCode, name, department, subDepartment, legalBases} = process
    let parsedLegalBases = legalBases && legalBases.map(legalBasis => ({
        gdpr: (legalBasis.gdpr && legalBasis.gdpr.code) || undefined,
        nationalLaw: (legalBasis.nationalLaw && legalBasis.nationalLaw.code) || undefined,
        description: legalBasis.description || undefined,
        start: legalBasis.start || undefined,
        end: legalBasis.end || undefined
    }))

    return {
        id: id,
        name: name,
        purposeCode: purposeCode,
        department: (department && department.code) || undefined,
        subDepartment: (subDepartment && subDepartment.code) || undefined,
        legalBases: parsedLegalBases
    } as ProcessFormValues
}

export const mapProcessFromForm = (values: ProcessFormValues) => {
    return {
        id: values.id,
        name: values.name,
        purposeCode: values.purposeCode,
        department: values.department ? values.department : undefined,
        subDepartment: values.subDepartment ? values.subDepartment : undefined,
        legalBases: values.legalBases ? values.legalBases : []
    }
}