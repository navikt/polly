import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'

import { Field, FieldProps, Form, Formik } from 'formik'

import { BlockProps } from 'baseui/block'
import { Button, KIND } from 'baseui/button'
import { Input, SIZE as InputSIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { LabelMedium } from 'baseui/typography'
import { CodeListFormValues, ProcessFormValues } from '../../constants'
import { Error } from '../common/ModalSchema'
import { codeListSchema } from '../common/schema'

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
  alignItems: 'center',
}

type ModalUpdateProps = {
  title: string
  initialValues: CodeListFormValues
  isOpen: boolean
  errorOnUpdate: any | undefined
  onClose: () => void
  submit: (process: CodeListFormValues) => Promise<void>
}

const UpdateCodeListModal = ({ title, initialValues, errorOnUpdate, isOpen, onClose, submit }: ModalUpdateProps) => {
  return (
    <Modal onClose={onClose} closeable isOpen={isOpen} animate autoFocus size={SIZE.auto} role={ROLE.dialog}>
      <div className="w-[700px] px-8">
        <Formik
          onSubmit={(values) => {
            submit(values)
            onClose()
          }}
          initialValues={{ ...initialValues }}
          validationSchema={codeListSchema()}
          render={(formik) => (
            <Form>
              <ModalHeader>{title}</ModalHeader>
              <ModalBody>
                <div className="flex w-full mt-4 items-center">
                  <LabelMedium marginRight={'1rem'} width="25%">
                    Short name:
                  </LabelMedium>
                  <Field
                    name="shortName"
                    render={({ field }: FieldProps<ProcessFormValues>) => (
                      <Input name="shortName" value={formik.values.shortName} onChange={formik.handleChange} type="input" size={InputSIZE.default} />
                    )}
                  />
                </div>
                <Error fieldName="shortName" />
                <div className="flex w-full mt-4 items-center">
                  <LabelMedium marginRight={'1rem'} width="25%">
                    Description:
                  </LabelMedium>
                  <Field
                    name="description"
                    render={({ field }: FieldProps<ProcessFormValues>) => (
                      <Textarea name="description" value={formik.values.description} onChange={formik.handleChange} type="input" />
                    )}
                  />
                </div>
                <Error fieldName="description" />
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end">
                  <div className="mr-auto">{errorOnUpdate && <p>{errorOnUpdate}</p>}</div>
                  <Button type="button" kind={KIND.secondary} onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </div>
              </ModalFooter>
            </Form>
          )}
        />
      </div>
    </Modal>
  )
}

export default UpdateCodeListModal
