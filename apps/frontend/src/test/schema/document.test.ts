import {
  addBatchInfoTypesToProcessSchema,
  addDocumentToProcessSchema,
  createDocumentSchema,
} from '../../components/common/schemaValidation'
import {
  ELegalBasesUse,
  IAddDocumentToProcessFormValues,
  ICreateDocumentFormValues,
  IPolicy,
  IProcess,
} from '../../constants'
import { EListName } from '../../service/Codelist'
import { addCode } from '../config/codelist'
import '../config/schemaValidator'

const senCode = addCode(EListName.SENSITIVITY, 'SEN')
const subCode = addCode(EListName.SUBJECT_CATEGORY, 'SUB')
const purposeCode = addCode(EListName.PURPOSE, 'PURPOSE')
const dataAccessClassCode = addCode(EListName.DATA_ACCESS_CLASS, 'ACCESS')

describe('Schema', () => {
  const schema = createDocumentSchema()
  const createDocument: () => ICreateDocumentFormValues = () => ({
    name: 'name',
    description: 'description',
    informationTypes: [
      {
        subjectCategories: ['BRUKER'],
        informationTypeId: 'id',
      },
    ],
    dataAccessClass: 'ACCESS',
  })

  it('CreateDocument ok', () => {
    expect(createDocument()).toBeSchema(schema)
  })

  it('CreateDocument errors', () => {
    expect({ ...createDocument(), name: '' }).toBeSchemaErrorAt(schema, 'name')
    expect({ ...createDocument(), description: '' }).toBeSchemaErrorAt(schema, 'description')
    expect({ ...createDocument(), informationTypes: [] }).toBeSchemaErrorAt(
      schema,
      'informationTypes'
    )

    const doc = createDocument()
    const it = doc.informationTypes[0]
    it.informationTypeId = ''
    expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].informationTypeId')
    it.informationTypeId = 'id'
    it.subjectCategories = []
    expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].subjectCategories')
  })
})

const addDocumentData: () => IAddDocumentToProcessFormValues = () => ({
  document: {
    id: 'id',
    name: 'name',
    description: 'desc',
    informationTypes: [],
    dataAccessClass: dataAccessClassCode,
  },
  informationTypes: [
    {
      informationType: {
        id: 'it_id',
        name: 'name',
        sensitivity: senCode,
      },
      informationTypeId: 'it_id',
      subjectCategories: [subCode],
    },
  ],
  process: {
    id: 'proc_id',
    name: 'name',
    purposes: [purposeCode],
  },
  linkDocumentToPolicies: true,
})

describe('AddDocument', () => {
  const addDocumentSchema = addDocumentToProcessSchema()

  it('Add Document ok', () => {
    expect(addDocumentData()).toBeSchema(addDocumentSchema)
  })

  it('Add Document errors', () => {
    expect({ ...addDocumentData(), informationTypes: [] }).toBeSchemaErrorAt(
      addDocumentSchema,
      'informationTypes'
    )
    expect({ ...addDocumentData(), document: undefined }).toBeSchemaErrorAt(
      addDocumentSchema,
      'document'
    )
    expect({ ...addDocumentData(), process: undefined }).toBeSchemaErrorAt(
      addDocumentSchema,
      'process'
    )
  })
})

describe('Policy', () => {
  const policy: IPolicy = {
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

  const addBatchSchema = addBatchInfoTypesToProcessSchema([policy], [subCode])
  const addBatch: () => IAddDocumentToProcessFormValues = () => ({
    ...addDocumentData(),
    linkDocumentToPolicies: false,
  })

  it('Add Batch ok', () => {
    expect(addBatch()).toBeSchema(addBatchSchema)
  })

  it('Add Batch errors', () => {
    expect({ ...addBatch(), informationTypes: [] }).toBeSchemaErrorAt(
      addBatchSchema,
      'informationTypes'
    )
    expect({ ...addBatch(), linkDocumentToPolicies: true }).toBeSchemaErrorAt(
      addBatchSchema,
      'linkDocumentToPolicies'
    )
  })

  it('Add Batch policy combo already exists', () => {
    const toAdd = addBatch()
    toAdd.informationTypes[0].informationType.id = 'it_id2'
    expect(toAdd).toBeSchemaErrorAt(
      addBatchSchema,
      'informationTypes[0]',
      'Behandlingen inneholder allerede personkategorien'
    )
  })
})
