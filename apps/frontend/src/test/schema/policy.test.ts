import '../config/schemaValidator'
import { policySchema } from '../../components/common/schema'
import { LegalBasesUse, Policy, PolicyFormValues, Process } from '../../constants'
import { addCode } from '../config/codelist'
import { ListName, SensitivityLevel } from '../../service/Codelist'

const senCode = addCode(ListName.SENSITIVITY, SensitivityLevel.ART6)
const senCode9 = addCode(ListName.SENSITIVITY, SensitivityLevel.ART9)
const subCode = addCode(ListName.SUBJECT_CATEGORY, 'PERSON')
const purposeCode = addCode(ListName.PURPOSE, 'PURPOSE')
const gdprCode = addCode(ListName.GDPR_ARTICLE, 'ART61A')
const gdprCode9 = addCode(ListName.GDPR_ARTICLE, 'ART9A')

const schema = policySchema()

const otherPolicy: Policy = {
  id: 'id',
  process: {
    id: 'pro_id',
  } as Process,
  subjectCategories: [subCode],
  informationType: {
    id: 'it_id2',
    name: 'name',
    sensitivity: senCode,
  },
  documentIds: [],
  legalBases: [],
  purposes: [purposeCode],
  legalBasesUse: LegalBasesUse.INHERITED_FROM_PROCESS,
}

const createPolicy: () => PolicyFormValues = () => ({
  informationType: {
    id: 'it_id',
    name: 'name',
    sensitivity: senCode,
  },
  subjectCategories: [subCode.code],
  legalBasesUse: LegalBasesUse.DEDICATED_LEGAL_BASES,
  legalBasesOpen: false,
  legalBases: [{ gdpr: gdprCode.code }],
  process: {
    id: 'proc_id',
    name: 'name',
    legalBases: [{ gdpr: gdprCode }],
  },
  purposes: ['PURPOSE2'],
  otherPolicies: [{ ...otherPolicy }],
  documentIds: [],
})

test('Policy ok', () => {
  expect(createPolicy()).toBeSchema(schema)
})

test('Policy ok UNRESOLVED', () => {
  const policy = createPolicy()
  policy.legalBases = []
  policy.process = { ...policy.process, legalBases: [] }
  policy.legalBasesUse = LegalBasesUse.UNRESOLVED
  expect(policy).toBeSchema(schema)
})

test('Policy ok EXCESS_INFO', () => {
  const policy = createPolicy()
  policy.legalBases = []
  policy.process = { ...policy.process, legalBases: [] }
  policy.legalBasesUse = LegalBasesUse.EXCESS_INFO
  expect(policy).toBeSchema(schema)
})

test('Policy missingLegalBasisForDedicated', () => {
  const policy = createPolicy()
  policy.legalBases = []
  expect(policy).toBeSchemaErrorAt(schema, 'legalBasesUse', 'Ingen behandlingsgrunnlag valgt')
})

test('Policy missingArt6LegalBasisForInfoType', () => {
  const policy = createPolicy()
  policy.process = { ...policy.process, legalBases: [] }
  policy.legalBases = []
  policy.legalBasesUse = LegalBasesUse.INHERITED_FROM_PROCESS
  expect(policy).toBeSchemaErrorAt(schema, 'informationType', 'krever et behandlingsgrunnlag med artikkel 6')
})

test('Policy missingArt9LegalBasisForSensitiveInfoType', () => {
  const policy = createPolicy()
  policy.informationType = { ...policy.informationType!, sensitivity: senCode9 }
  policy.legalBasesUse = LegalBasesUse.INHERITED_FROM_PROCESS
  expect(policy).toBeSchemaErrorAt(schema, 'informationType', 'krever et behandlingsgrunnlag med artikkel 9')
  policy.legalBasesUse = LegalBasesUse.DEDICATED_LEGAL_BASES
  expect(policy).toBeSchemaErrorAt(schema, 'informationType', 'krever et behandlingsgrunnlag med artikkel 9')

  // covered
  policy.legalBases = [{ gdpr: gdprCode9.code }]
  expect(policy).toBeSchema(schema)
  // covered by process
  policy.legalBases = createPolicy().legalBases
  policy.legalBasesUse = LegalBasesUse.INHERITED_FROM_PROCESS
  policy.process = { ...policy.process, legalBases: [{ gdpr: gdprCode9 }] }
  expect(policy).toBeSchema(schema)
})

test('Policy informationType-SubjectCategory combo already exists', () => {
  const policy = createPolicy()
  policy.informationType = { ...otherPolicy.informationType }
  expect(policy).toBeSchemaErrorAt(schema, 'subjectCategories', "Behandlingen inneholder allerede personkategorien PERSON name for opplysningstype name")
})
