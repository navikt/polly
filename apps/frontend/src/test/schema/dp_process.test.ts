import {dpProcessSchema} from '../../components/common/schema'
import {DpProcessFormValues} from '../../constants'
import '../config/schemaValidator'

const schema = dpProcessSchema()
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
  expect(createDp()).toBeSchema(schema)
})

test('dpProcess processor', () => {
  const dp = createDp()
  dp.subDataProcessing.dataProcessorOutsideEU = true
  expect(dp).toBeSchemaErrorAt(schema, 'subDataProcessing.transferCountries')
  dp.subDataProcessing.transferCountries = ['USA']
  expect(dp).toBeSchemaErrorAt(schema, 'subDataProcessing.transferGroundsOutsideEU')
  dp.subDataProcessing.transferGroundsOutsideEU = 'REASON'
  expect(dp).toBeSchema(schema)

  // OTHER requires an additional manual reason
  dp.subDataProcessing.transferGroundsOutsideEU = 'OTHER'
  expect(dp).toBeSchemaErrorAt(schema, 'subDataProcessing.transferGroundsOutsideEUOther')
  dp.subDataProcessing.transferGroundsOutsideEUOther = 'some reason'
  expect(dp).toBeSchema(schema)
})
