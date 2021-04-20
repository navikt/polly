import {ObjectSchema, ValidationError} from 'yup'

expect.extend({
  toBeSchema: <R extends object>(obj: R, schema: ObjectSchema<R>) => {
    try {
      schema.validateSync(obj)
    } catch (error) {
      const validation = error as ValidationError
      return {
        pass: false,
        message: () => `Mismatch ${validation.path}: ${validation.message}`
      }
    }
    return {
      pass: true,
      message: () => 'ok'
    }
  },
  toBeSchemaErrorAt: <R extends object>(obj: R, schema: ObjectSchema<R>, path: string, message?: string) => {
    try {
      schema.validateSync(obj)
    } catch (error) {
      const validation = error as ValidationError
      const pathError = validation.path !== path
      const messageError = message !== undefined && validation.message.indexOf(message) < 0
      return {
        pass: !pathError && !messageError,
        message: () => pathError ? `Error in wrong path, expected: ${path} - Found: ${validation.path}: ${validation.message}` : `Wrong error message, expected: ${message} - Found: ${validation.message}`
      }
    }
    return {
      pass: false,
      message: () => `Expected an error at ${path}`
    }
  }
})
