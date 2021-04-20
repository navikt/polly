import {dataProcessorSchema, dpProcessSchema, infoTypeSchema, processSchema} from '../components/common/schema'
import {DpProcessFormValues, InformationtypeFormValues, ProcessFormValues, ProcessorFormValues, ProcessStatus} from '../constants'
import './config/schemaValidator'
import {codelist, ListName, NATIONAL_LAW_GDPR_ARTICLES} from '../service/Codelist'

// Mock codelist
codelist.lists = {
  codelist: {}
}
const addCode = (list: ListName, code: string) => codelist.lists!.codelist[list] = [...(codelist.lists?.codelist[list] || []), {
  list,
  code,
  shortName: code + ' name',
  description: code + ' desc'
}]
addCode(ListName.PURPOSE, 'PURPOSE')

const itSchema = infoTypeSchema()
const createInfoType: () => InformationtypeFormValues = () => ({
  name: 'name',
  description: '',
  sensitivity: 'SEN',
  categories: ['CAT'],
  keywords: [],
  productTeams: [],
  sources: []
})

test('informationType ok', () => {
  expect(createInfoType()).toBeSchema(itSchema)
});

test('informationType req sensitivty', () => {
  const it = createInfoType()
  it.sensitivity = ''
  expect(it).toBeSchemaErrorAt(itSchema, 'sensitivity')
});

test('informationType req category', () => {
  const it = {...createInfoType(), categories: []}
  expect(it).toBeSchemaErrorAt(itSchema, 'categories', 'påkrevd')
});

const processorSchema = dataProcessorSchema()
const createProcessor: () => ProcessorFormValues = () => ({
  name: 'name',
  countries: []
})

test('processor ok', () => {
  expect(createProcessor()).toBeSchema(processorSchema)
})

test('processor outsideEU requires transfer grounds', () => {
  const processor = createProcessor()
  processor.outsideEU = true
  expect(processor).toBeSchemaErrorAt(processorSchema, 'countries')
  processor.countries = ['USA']
  expect(processor).toBeSchemaErrorAt(processorSchema, 'transferGroundsOutsideEU')
  processor.transferGroundsOutsideEU = 'REASON'
  expect(processor).toBeSchema(processorSchema)

  // OTHER requires an additional manual reason
  processor.transferGroundsOutsideEU = 'OTHER'
  expect(processor).toBeSchemaErrorAt(processorSchema, 'transferGroundsOutsideEUOther')
  processor.transferGroundsOutsideEUOther = 'some reason'
  expect(processor).toBeSchema(processorSchema)
})

const dpSchema = dpProcessSchema()
const createDp: () => DpProcessFormValues = () => ({
  name: 'name',
  dataProcessingAgreements: [],
  affiliation: {
    department: '',
    productTeams: [],
    products: [],
    subDepartments: []
  },
  retention: {
    retentionMonths: 2,
    retentionStart: 'august'
  },
  subDataProcessing: {
    dataProcessor: true,
    transferCountries: [],
    dataProcessorAgreements: []
  }
})

test('dpProcess ok', () => {
  expect(createDp()).toBeSchema(dpSchema)
})

test('dpProcess processor', () => {
  const dp = createDp()
  dp.subDataProcessing.dataProcessorOutsideEU = true
  expect(dp).toBeSchemaErrorAt(dpSchema, 'subDataProcessing.transferCountries')
  dp.subDataProcessing.transferCountries = ['USA']
  expect(dp).toBeSchemaErrorAt(dpSchema, 'subDataProcessing.transferGroundsOutsideEU')
  dp.subDataProcessing.transferGroundsOutsideEU = 'REASON'
  expect(dp).toBeSchema(dpSchema)

  // OTHER requires an additional manual reason
  dp.subDataProcessing.transferGroundsOutsideEU = 'OTHER'
  expect(dp).toBeSchemaErrorAt(dpSchema, 'subDataProcessing.transferGroundsOutsideEUOther')
  dp.subDataProcessing.transferGroundsOutsideEUOther = 'some reason'
  expect(dp).toBeSchema(dpSchema)
})

const procSchema = processSchema()
const createProcess: () => ProcessFormValues = () => ({
  name: 'name',
  purposes: ['PURPOSE'],
  affiliation: {
    productTeams: [],
    products: [],
    subDepartments: []
  },
  legalBases: [],
  legalBasesOpen: false,
  dataProcessing: {
    dataProcessor: true,
    processors: []
  },
  retention: {
    retentionMonths: 2,
    retentionStart: 'august'
  },
  status: ProcessStatus.IN_PROGRESS,
  dpia: {
    grounds: 'reason',
    processImplemented: true,
    refToDpia: 'ref',
    noDpiaReasons: []
  },
  disclosures: []
})

test('Process ok', () => {
  expect(createProcess()).toBeSchema(procSchema)
})

test('Process purposes required', () => {
  const process = {...createProcess(), purposes: []}
  expect(process).toBeSchemaErrorAt(procSchema, 'purposes')
})

test('Process legalBasis', () => {
  let process = {...createProcess(), legalBases: [{gdpr: NATIONAL_LAW_GDPR_ARTICLES[0]}]}
  expect(process).toBeSchemaErrorAt(procSchema, 'legalBases[0].description')
  process = {...createProcess(), legalBases: [{gdpr: NATIONAL_LAW_GDPR_ARTICLES[0], description: 'desc'}]}
  expect(process).toBeSchemaErrorAt(procSchema, 'legalBases[0].nationalLaw')
  process = {...createProcess(), legalBases: [{gdpr: NATIONAL_LAW_GDPR_ARTICLES[0], description: 'desc', nationalLaw: 'LAW_1'}]}
  expect(process).toBeSchema(procSchema)
})
