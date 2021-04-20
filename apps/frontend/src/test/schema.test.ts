import {dataProcessorSchema, infoTypeSchema} from '../components/common/schema'
import {InformationtypeFormValues, ProcessorFormValues} from '../constants'
import './config/schemaValidator'

const itSchema = infoTypeSchema()
const it: InformationtypeFormValues = {
  name: 'name',
  description: '',
  sensitivity: 'SEN',
  categories: ['CAT'],
  keywords: [],
  productTeams: [],
  sources: []
}

test('informationType ok', () => {
  expect(it).toBeSchema(itSchema)
});

test('informationType req sensitivty', () => {
  it.sensitivity = ''
  expect(it).toBeSchemaErrorAt(itSchema, 'sensitivity')
});

test('informationType req category', () => {
  it.categories = []
  expect(it).toBeSchemaErrorAt(itSchema, 'categories', 'påkrevd')
});

const processorSchema = dataProcessorSchema()
const processor: ProcessorFormValues = {
  name: 'name',
  countries: []
}

test('processor ok', () => {
  expect(processor).toBeSchema(processorSchema)
})

test('processor outsideEU requires transfer grounds', () => {
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


