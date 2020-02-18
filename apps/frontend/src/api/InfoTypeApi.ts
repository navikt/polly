import axios from "axios"
import { InformationType, InformationtypeFormValues, PageResponse, Policy, PolicyInformationType } from "../constants"
import { default as React, Dispatch, SetStateAction, useEffect } from "react"
import { useDebouncedState } from "../util"
import { env } from "../util/env"

export const getInformationTypes = async (page: number, limit: number) => {
    return (await axios.get<PageResponse<InformationType>>(`${env.pollyBaseUrl}/informationtype?pageNumber=${page - 1}&pageSize=${limit}`)).data
}

export const searchInformationType = async (text: string) => {
    return (await axios.get<PageResponse<InformationType>>(`${env.pollyBaseUrl}/informationtype/search/${text}`)).data
}

export const getInformationType = async (informationTypeId: string) => {
    return (await axios.get<InformationType>(`${env.pollyBaseUrl}/informationtype/${informationTypeId}`)).data
}

export const deleteInformationType = async (informationTypeId: string) => {
  return (await axios.delete<Policy>(`${env.pollyBaseUrl}/informationtype/${informationTypeId}`)).data
}

export const createInformationType = async (informationType: InformationtypeFormValues) => {
    return (await axios.post<PageResponse<InformationType>>(`${env.pollyBaseUrl}/informationtype`, [informationType])).data.content[0]
}

export const updateInformationType = async (informationType: InformationtypeFormValues) => {
    return (await axios.put<InformationType>(`${env.pollyBaseUrl}/informationtype/${informationType.id}`, informationType)).data
}

export const useInfoTypeSearch = () => {
    const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = React.useState<PolicyInformationType[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const search = async () => {
            if (infoTypeSearch && infoTypeSearch.length > 2) {
                setLoading(true)
                const res = await searchInformationType(infoTypeSearch)
                setInfoTypeSearchResult(res.content)
                setLoading(false)
            }
        }
        search()
    }, [infoTypeSearch])

    return [infoTypeSearchResult, setInfoTypeSearch, loading] as [PolicyInformationType[], Dispatch<SetStateAction<string>>, boolean]
}
