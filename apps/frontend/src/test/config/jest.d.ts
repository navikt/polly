import {ObjectSchema} from 'yup'


declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSchema(value: ObjectSchema<any>): CustomMatcherResult

      toBeSchemaErrorAt(value: ObjectSchema<any>, path: string, message?: string): CustomMatcherResult
    }
  }
}
