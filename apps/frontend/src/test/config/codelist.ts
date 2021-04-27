// Mock codelist
import {codelist, ListName} from '../../service/Codelist'

codelist.lists = {
  codelist: {}
}
export const addCode = (list: ListName, code: string) => {
  const newCode = {
    list,
    code,
    shortName: code + ' name',
    description: code + ' desc'
  }
  codelist.lists!.codelist[list] = [...(codelist.lists?.codelist[list] || []), newCode]
  return newCode
}
