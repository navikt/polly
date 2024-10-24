// Mock codelist
import { CodelistService, EListName } from '../../service/Codelist'

// Trenger hjelp
const [, lists] = CodelistService()

lists = {
  codelist: {},
}
export const addCode = (list: EListName, code: string) => {
  const newCode = {
    list,
    code,
    shortName: code + ' name',
    description: code + ' desc',
  }
  lists!.codelist[list] = [...(lists?.codelist[list] || []), newCode]
  return newCode
}
