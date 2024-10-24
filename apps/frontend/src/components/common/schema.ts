import * as yup from 'yup'
import { IInformationTypeShort, IPolicy } from '../../constants'
import { CodelistService, EListName, ICode } from '../../service/Codelist'

export const subjectCategoryExistsGen = (
  informationType: IInformationTypeShort,
  subjectCategories: string[],
  path: string,
  context: yup.TestContext<any>,
  otherPolicies: IPolicy[]
) => {
  const [codelistUtils] = CodelistService()

  const existingPolicyIdents: string[] = otherPolicies.flatMap((policy: IPolicy) =>
    policy.subjectCategories.map(
      (subjectCategory: ICode) => policy.informationType.id + '.' + subjectCategory.code
    )
  )
  const matchingIdents: string[] = subjectCategories
    .map((subjectCategory: string) => informationType?.id + '.' + subjectCategory)
    .filter((policyIdent: string) => existingPolicyIdents.indexOf(policyIdent) >= 0)
  const errors: string[] = matchingIdents
    .map((ident: string) =>
      codelistUtils.getShortname(
        EListName.SUBJECT_CATEGORY,
        ident.substring(ident.indexOf('.') + 1)
      )
    )
    .map(
      (category: string) =>
        `Behandlingen inneholder allerede personkategorien ${category} for opplysningstype ${informationType.name}`
    )
  return errors.length ? context.createError({ path, message: errors.join(', ') }) : true
}
