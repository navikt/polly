import { dataProcessorSchema } from '../../components/common/schemaValidation'
import { IProcessorFormValues } from '../../constants'
import '../config/schemaValidator'

const schema = dataProcessorSchema()
const createProcessor = (): IProcessorFormValues => ({
  name: 'name',
  countries: [],
  operationalContractManagers: [],
})

test('processor ok', () => {
  expect(createProcessor()).toBeSchema(schema)
})

test('processor outsideEU requires transfer grounds', () => {
  const processor = createProcessor()
  processor.outsideEU = true
  expect(processor).toBeSchemaErrorAt(schema, 'countries')
  processor.countries = ['USA']
  expect(processor).toBeSchemaErrorAt(schema, 'transferGroundsOutsideEU')
  processor.transferGroundsOutsideEU = 'REASON'
  expect(processor).toBeSchema(schema)

  // OTHER requires an additional manual reason
  processor.transferGroundsOutsideEU = 'OTHER'
  expect(processor).toBeSchemaErrorAt(schema, 'transferGroundsOutsideEUOther')
  processor.transferGroundsOutsideEUOther = 'some reason'
  expect(processor).toBeSchema(schema)
})
