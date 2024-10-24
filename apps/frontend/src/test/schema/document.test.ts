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

it('Schema', () => {
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

  test('CreateDocument ok', () => {
    expect(createDocument()).toBeSchema(schema)
  })

  test('CreateDocument errors', () => {
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

it('AddDocument', () => {
  const addDocumentSchema = addDocumentToProcessSchema()
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

  test('Add Document ok', () => {
    expect(addDocumentData()).toBeSchema(addDocumentSchema)
  })

  test('Add Document errors', () => {
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

it('Policy', () => {
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

  const addBatchSchema = addBatchInfoTypesToProcessSchema([policy])
  const addBatch: () => IAddDocumentToProcessFormValues = () => ({
    ...addDocumentData(),
    linkDocumentToPolicies: false,
  })

  test('Add Batch ok', () => {
    expect(addBatch()).toBeSchema(addBatchSchema)
  })

  test('Add Batch errors', () => {
    expect({ ...addBatch(), informationTypes: [] }).toBeSchemaErrorAt(
      addBatchSchema,
      'informationTypes'
    )
    expect({ ...addBatch(), linkDocumentToPolicies: true }).toBeSchemaErrorAt(
      addBatchSchema,
      'linkDocumentToPolicies'
    )
  })

  test('Add Batch policy combo already exists', () => {
    const toAdd = addBatch()
    toAdd.informationTypes[0].informationType.id = 'it_id2'
    expect(toAdd).toBeSchemaErrorAt(
      addBatchSchema,
      'informationTypes[0]',
      'Behandlingen inneholder allerede personkategorien'
    )
  })
})
