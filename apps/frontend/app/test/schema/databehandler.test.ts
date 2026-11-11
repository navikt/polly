import { databehandlerSchema } from '../../components/common/schemaValidation'
import { IDatabehandlerFormValues } from '../../constants'
import '../config/schemaValidator'

const schema = databehandlerSchema()
const createDatabehandler = (): IDatabehandlerFormValues => ({
  navn: 'navn',
  landDataOverforesTil: [],
  fagansvarlig: [],
})

test('databehandler ok', () => {
  expect(createDatabehandler()).toBeSchema(schema)
})

test('databehandler behandlingUtenforEuEos krever overforingsgrunnlag', () => {
  const databehandler = createDatabehandler()
  databehandler.behandlingUtenforEuEos = true
  expect(databehandler).toBeSchemaErrorAt(schema, 'landDataOverforesTil')
  databehandler.landDataOverforesTil = ['USA']
  expect(databehandler).toBeSchemaErrorAt(schema, 'overforingsgrunnlagUtenforEuEos')
  databehandler.overforingsgrunnlagUtenforEuEos = 'REASON'
  expect(databehandler).toBeSchema(schema)

  // OTHER requires an additional manual reason
  databehandler.overforingsgrunnlagUtenforEuEos = 'OTHER'
  expect(databehandler).toBeSchemaErrorAt(schema, 'overforingsgrunnlagUtenforEuEosAnnet')
  databehandler.overforingsgrunnlagUtenforEuEosAnnet = 'some reason'
  expect(databehandler).toBeSchema(schema)
})
