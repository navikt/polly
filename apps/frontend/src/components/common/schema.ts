import * as yup from 'yup'
import { IInformationTypeShort, IPolicy } from '../../constants'
import { ICode } from '../../service/Codelist'

export const subjectCategoryExistsGen = (
  informationType: IInformationTypeShort,
  subjectCategories: string[],
  path: string,
  context: yup.TestContext<any>,
  otherPolicies: IPolicy[],
  subjectCategoryList: ICode[]
) => {
  const existingPolicyIdents: string[] = otherPolicies.flatMap((policy: IPolicy) =>
    policy.subjectCategories.map(
      (subjectCategory: ICode) => policy.informationType.id + '.' + subjectCategory.code
    )
  )
  const matchingIdents: string[] = subjectCategories
    .map((subjectCategory: string) => informationType?.id + '.' + subjectCategory)
    .filter((policyIdent: string) => existingPolicyIdents.indexOf(policyIdent) >= 0)
  const errors: string[] = matchingIdents
    .map((ident: string) => {
      const matchingCategory = subjectCategoryList.filter(
        (subjectCategory) => subjectCategory.code === ident.substring(ident.indexOf('.') + 1)
      )
      if (matchingCategory.length > 0) {
        return matchingCategory[0].shortName
      } else {
        return ident
      }
    })
    .map(
      (category: string) =>
        `Behandlingen inneholder allerede personkategorien ${category} for opplysningstype ${informationType.name}`
    )
  return errors.length ? context.createError({ path, message: errors.join(', ') }) : true
}
