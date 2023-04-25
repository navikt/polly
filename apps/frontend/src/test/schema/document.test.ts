import { addBatchInfoTypesToProcessSchema, addDocumentToProcessSchema, createDocumentSchema } from '../../components/common/schema'
import { AddDocumentToProcessFormValues, CreateDocumentFormValues, LegalBasesUse, Policy, Process } from '../../constants'
import '../config/schemaValidator'
import { addCode } from '../config/codelist'
import { ListName } from '../../service/Codelist'

const senCode = addCode(ListName.SENSITIVITY, 'SEN')
const subCode = addCode(ListName.SUBJECT_CATEGORY, 'SUB')
const purposeCode = addCode(ListName.PURPOSE, 'PURPOSE')
const dataAccessClassCode = addCode(ListName.DATA_ACCESS_CLASS, 'ACCESS')

const schema = createDocumentSchema()
const createDocument: () => CreateDocumentFormValues = () => ({
  name: 'name',
  description: 'description',
  informationTypes: [
    {
      subjectCategories: ['BRUKER'],
      informationTypeId: 'id',
    },
  ],
  dataAccessClass: 'ACCESS'
})

test('CreateDocument ok', () => {
  expect(createDocument()).toBeSchema(schema)
})

test('CreateDocument errors', () => {
  expect({ ...createDocument(), name: '' }).toBeSchemaErrorAt(schema, 'name')
  expect({ ...createDocument(), description: '' }).toBeSchemaErrorAt(schema, 'description')
  expect({ ...createDocument(), informationTypes: [] }).toBeSchemaErrorAt(schema, 'informationTypes')

  const doc = createDocument()
  const it = doc.informationTypes[0]
  it.informationTypeId = ''
  expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].informationTypeId')
  it.informationTypeId = 'id'
  it.subjectCategories = []
  expect(doc).toBeSchemaErrorAt(schema, 'informationTypes[0].subjectCategories')
})

const addDocumentSchema = addDocumentToProcessSchema()
const addDocumentData: () => AddDocumentToProcessFormValues = () => ({
  document: {
    id: 'id',
    name: 'name',
    description: 'desc',
    informationTypes: [],
    dataAccessClass: dataAccessClassCode
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

test('Add Document ok', () => {
  expect(addDocumentData()).toBeSchema(addDocumentSchema)
})

test('Add Document errors', () => {
  expect({ ...addDocumentData(), informationTypes: [] }).toBeSchemaErrorAt(addDocumentSchema, 'informationTypes')
  expect({ ...addDocumentData(), document: undefined }).toBeSchemaErrorAt(addDocumentSchema, 'document')
  expect({ ...addDocumentData(), process: undefined }).toBeSchemaErrorAt(addDocumentSchema, 'process')
})

const policy: Policy = {
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

const addBatchSchema = addBatchInfoTypesToProcessSchema([policy])
const addBatch: () => AddDocumentToProcessFormValues = () => ({
  ...addDocumentData(),
  linkDocumentToPolicies: false,
})

test('Add Batch ok', () => {
  expect(addBatch()).toBeSchema(addBatchSchema)
})

test('Add Batch errors', () => {
  expect({ ...addBatch(), informationTypes: [] }).toBeSchemaErrorAt(addBatchSchema, 'informationTypes')
  expect({ ...addBatch(), linkDocumentToPolicies: true }).toBeSchemaErrorAt(addBatchSchema, 'linkDocumentToPolicies')
})

test('Add Batch policy combo already exists', () => {
  const toAdd = addBatch()
  toAdd.informationTypes[0].informationType.id = 'it_id2'
  expect(toAdd).toBeSchemaErrorAt(addBatchSchema, 'informationTypes[0]', 'Behandlingen inneholder allerede personkategorien')
})
