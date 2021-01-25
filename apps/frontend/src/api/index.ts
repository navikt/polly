import {PageResponse} from '../constants'

export * from "./CodelistApi";
export * from "./UserApi";

export * from "./InfoTypeApi";
export * from "./PolicyApi";
export * from "./ProcessApi";
export * from "./DisclosureApi";
export * from "./DocumentApi";

export * from "./TermApi";
export * from "./TeamApi";
export * from "./DashboardApi";

// Bad practice to "get all" but we'll allow it for objects that aren't that big/numerous such as documents and disclosures
export const getAll = <T>(fetcher: (pageNumber: number, pageSize: number) => Promise<PageResponse<T>>) => async () => {
  const PAGE_SIZE = 100
  const firstPage = await fetcher(0, PAGE_SIZE)
  if (firstPage.pages < 2) {
    return [...firstPage.content]
  } else {
    let all: T[] = [...firstPage.content]
    for (let currentPage = 1; currentPage < firstPage.pages; currentPage++) {
      all = [...all, ...(await fetcher(currentPage, PAGE_SIZE)).content]
    }
    return all
  }
}
