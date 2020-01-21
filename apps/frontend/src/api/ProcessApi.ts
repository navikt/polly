import axios from "axios";
import { PageResponse, Process, ProcessFormValues, ProcessPurposeCount } from "../constants";
import { env } from "../util/env"

export const getProcess = async (processId: string) => {
    return (await axios.get<Process>(`${env.pollyBaseUrl}/process/${processId}`))
        .data;
};

export const getProcessesForPurpose = async (purpose: string) => {
    return (
        await axios.get<PageResponse<Process>>(
            `${env.pollyBaseUrl}/process/purpose/${purpose}`
        )
    ).data;
};

export const getProcessPurposeCount = async () => {
    return (
        await axios.get<ProcessPurposeCount>(
            `${env.pollyBaseUrl}/process/count/purpose`
        )
    ).data;
};

export const createProcess = async (process: ProcessFormValues) => {
    let body = mapProcessFromForm(process);
    return (
        await axios.post<Process>(`${env.pollyBaseUrl}/process`, body)
    ).data;
};

export const deleteProcess = async (processId: string) => {
    return (await axios.delete<Process>(`${env.pollyBaseUrl}/process/${processId}`))
        .data;
};

export const updateProcess = async (process: ProcessFormValues) => {
    let body = mapProcessFromForm(process);
    return (
        await axios.put<Process>(`${env.pollyBaseUrl}/process/${process.id}`, body)
    ).data;
};

export const convertProcessToFormValues = (process: Process) => {
    const {
        id,
        purposeCode,
        name,
        department,
        subDepartment,
        productTeam,
        legalBases,
        start,
        end
    } = process;
    let parsedLegalBases =
        legalBases &&
        legalBases.map(legalBasis => ({
            gdpr: (legalBasis.gdpr && legalBasis.gdpr.code) || undefined,
            nationalLaw:
                (legalBasis.nationalLaw && legalBasis.nationalLaw.code) ||
                undefined,
            description: legalBasis.description || undefined,
            start: legalBasis.start || undefined,
            end: legalBasis.end || undefined
        }));

    return {
        legalBasesOpen: false,
        id: id,
        name: name,
        purposeCode: purposeCode,
        department: (department && department.code) || undefined,
        subDepartment: (subDepartment && subDepartment.code) || undefined,
        productTeam: productTeam || undefined,
        legalBases: parsedLegalBases,
        start: start || undefined,
        end: end || undefined
    } as ProcessFormValues;
};

export const mapProcessFromForm = (values: ProcessFormValues) => {
    return {
        id: values.id,
        name: values.name,
        purposeCode: values.purposeCode,
        department: values.department ? values.department : undefined,
        subDepartment: values.subDepartment ? values.subDepartment : undefined,
        productTeam: values.productTeam,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end
    };
};
