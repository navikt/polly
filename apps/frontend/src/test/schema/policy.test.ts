import { policySchema } from '../../components/common/schemaValidation'
import { ELegalBasesUse, IPolicy, IPolicyFormValues, IProcess } from '../../constants'
import { EListName, ESensitivityLevel, ICode } from '../../service/Codelist'
import { addCode } from '../config/codelist'
import '../config/schemaValidator'

describe('Policy', () => {
  const senCode: ICode = addCode(EListName.SENSITIVITY, ESensitivityLevel.ART6)
  const senCode9: ICode = addCode(EListName.SENSITIVITY, ESensitivityLevel.ART9)
  const subCode: ICode = addCode(EListName.SUBJECT_CATEGORY, 'PERSON')
  const purposeCode: ICode = addCode(EListName.PURPOSE, 'PURPOSE')
  const gdprCode: ICode = addCode(EListName.GDPR_ARTICLE, 'ART61A')
  const gdprCode9: ICode = addCode(EListName.GDPR_ARTICLE, 'ART9A')

  const schema = policySchema()

  const otherPolicy: IPolicy = {
    id: 'id',
    process: {
      id: 'pro_id',
    } as IProcess,
    subjectCategories: [subCode],
    informationType: {
      id: 'it_id2',
      name: 'name',
      sensitivity: senCode,
    },
    documentIds: [],
    legalBases: [],
    purposes: [purposeCode],
    legalBasesUse: ELegalBasesUse.INHERITED_FROM_PROCESS,
  }

  const createPolicy: () => IPolicyFormValues = () => ({
    informationType: {
      id: 'it_id',
      name: 'name',
      sensitivity: senCode,
    },
    subjectCategories: [subCode.code],
    legalBasesUse: ELegalBasesUse.DEDICATED_LEGAL_BASES,
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

  it('Policy ok', () => {
    expect(createPolicy()).toBeSchema(schema)
  })

  it('Policy ok UNRESOLVED', () => {
    const policy: IPolicyFormValues = createPolicy()
    policy.legalBases = []
    policy.process = { ...policy.process, legalBases: [] }
    policy.legalBasesUse = ELegalBasesUse.UNRESOLVED
    expect(policy).toBeSchema(schema)
  })

  it('Policy ok EXCESS_INFO', () => {
    const policy: IPolicyFormValues = createPolicy()
    policy.legalBases = []
    policy.process = { ...policy.process, legalBases: [] }
    policy.legalBasesUse = ELegalBasesUse.EXCESS_INFO
    expect(policy).toBeSchema(schema)
  })

  it('Policy missingLegalBasisForDedicated', () => {
    const policy: IPolicyFormValues = createPolicy()
    policy.legalBases = []
    expect(policy).toBeSchemaErrorAt(schema, 'legalBasesUse', 'Ingen behandlingsgrunnlag valgt')
  })

  it('Policy missingArt6LegalBasisForInfoType', () => {
    const policy: IPolicyFormValues = createPolicy()
    policy.process = { ...policy.process, legalBases: [] }
    policy.legalBases = []
    policy.legalBasesUse = ELegalBasesUse.INHERITED_FROM_PROCESS
    expect(policy).toBeSchemaErrorAt(
      schema,
      'informationType',
      'krever et behandlingsgrunnlag med artikkel 6'
    )
  })

  it('Policy missingArt9LegalBasisForSensitiveInfoType', () => {
    const policy: IPolicyFormValues = createPolicy()
    if (policy.informationType) {
      policy.informationType = { ...policy.informationType, sensitivity: senCode9 }
    }
    policy.legalBasesUse = ELegalBasesUse.INHERITED_FROM_PROCESS
    expect(policy).toBeSchemaErrorAt(
      schema,
      'informationType',
      'krever et behandlingsgrunnlag med artikkel 9'
    )
    policy.legalBasesUse = ELegalBasesUse.DEDICATED_LEGAL_BASES
    expect(policy).toBeSchemaErrorAt(
      schema,
      'informationType',
      'krever et behandlingsgrunnlag med artikkel 9'
    )

    // covered
    policy.legalBases = [{ gdpr: gdprCode9.code }]
    expect(policy).toBeSchema(schema)
    // covered by process
    policy.legalBases = createPolicy().legalBases
    policy.legalBasesUse = ELegalBasesUse.INHERITED_FROM_PROCESS
    policy.process = { ...policy.process, legalBases: [{ gdpr: gdprCode9 }] }
    expect(policy).toBeSchema(schema)
  })

  it('Policy informationType-SubjectCategory combo already exists', () => {
    const policy: IPolicyFormValues = createPolicy()
    policy.informationType = { ...otherPolicy.informationType }
    expect(policy).toBeSchemaErrorAt(
      schema,
      'subjectCategories',
      'Behandlingen inneholder allerede personkategorien PERSON name for opplysningstype name'
    )
  })
})
