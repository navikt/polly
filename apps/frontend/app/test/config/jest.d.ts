/* eslint-disable no-unused-vars */
import { ObjectSchema } from 'yup'

declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    interface Matchers<R> {
      toBeSchema(value: ObjectSchema<any>): CustomMatcherResult

      toBeSchemaErrorAt(
        value: ObjectSchema<any>,
        path: string,
        message?: string
      ): CustomMatcherResult
    }
  }
}
