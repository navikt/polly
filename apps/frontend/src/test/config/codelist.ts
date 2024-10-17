// Mock codelist
import { EListName, codelist } from '../../service/Codelist'

codelist.lists = {
  codelist: {},
}
export const addCode = (list: EListName, code: string) => {
  const newCode = {
    list,
    code,
    shortName: code + ' name',
    description: code + ' desc',
  }
  codelist.lists!.codelist[list] = [...(codelist.lists?.codelist[list] || []), newCode]
  return newCode
}
