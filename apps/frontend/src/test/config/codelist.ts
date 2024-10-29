// Mock codelist
import { CodelistService, EListName } from '../../service/Codelist'

const [, lists, setLists] = CodelistService()

export const addCode = (list: EListName, code: string) => {
  setLists({ codelist: {} })
  const newCode = {
    list,
    code,
    shortName: code + ' name',
    description: code + ' desc',
  }
  if (lists) {
    lists.codelist[list] = [...(lists.codelist[list] || []), newCode]
  }
  return newCode
}
