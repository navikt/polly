import React, {KeyboardEvent} from "react";
import {Block, BlockProps} from "baseui/block";
import {Label2} from "baseui/typography";
import {intl, useAwait} from "../../../util";
import {Input, SIZE} from "baseui/input";
import {Textarea} from "baseui/textarea";
import {CreateDocumentFormValues} from "../../../constants";
import InformationTypesTable from "./InformationTypesTable";
import {Field, FieldArray, FieldProps, Form, Formik, FormikProps} from "formik";
import {Button} from "baseui/button";
import {Error} from "../../common/ModalSchema";
import {user} from "../../../service/User";
import {createInformationTypesDocument} from "../../../api";
import {createDocumentValidation} from "../../common/schema";
import {Notification} from "baseui/notification";

const rowBlockProps: BlockProps = {
  width: '100%',
  marginTop: '1rem',
};

const CreateDocument = () => {
  const [description, setDescription] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();

  const hasAccess = () => user.canWrite();
  useAwait(user.wait())

  let initialCreateDocumentFormValues: CreateDocumentFormValues = {
    name: "",
    description: "",
    informationTypes: []
  };

  const handleCreateDocument = (values: CreateDocumentFormValues,resetForm:Function) => {
    setResponseMessage(null)
    let body = {...values};
    try {
      createInformationTypesDocument(body);
      setResponseMessage(intl.createdDocument);
      resetForm()
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return hasAccess() && !isLoading ? (
    <React.Fragment>
      <Formik
        initialValues={initialCreateDocumentFormValues}
        onSubmit={(values: CreateDocumentFormValues, {resetForm}) => {
          handleCreateDocument(values,resetForm);
        }}
        validationSchema={createDocumentValidation()}
      >
        {
          (formikProps: FormikProps<CreateDocumentFormValues>) => (
            <Form onKeyDown={disableEnter}>
              <Block {...rowBlockProps}>
                <Label2>{intl.name}</Label2>
                <Field name="name">
                  {
                    (props: FieldProps) => (
                      <Input type="text" size={SIZE.default} {...props.field}/>
                    )
                  }
                </Field>
                <Error fieldName="name" fullWidth={true}/>
              </Block>
              <Block {...rowBlockProps}>
                <Label2>{intl.description}</Label2>
                <Field name="description">
                  {
                    (props: FieldProps) => (
                      <Textarea
                        value={description}
                        onChange={event => setDescription((event.target as HTMLTextAreaElement).value)}
                        {...props.field}
                      />
                    )
                  }
                </Field>
                <Error fieldName="description" fullWidth={true}/>
              </Block>

              <Block {...rowBlockProps}>
                <FieldArray
                  name="informationTypes"
                  render={
                    arrayHelpers => (
                      <InformationTypesTable
                        arrayHelpers={arrayHelpers}
                      />
                    )
                  }
                />
              </Block>
              <Block display="flex" flexDirection="row-reverse">
                <Button
                  type="submit"
                  overrides={{
                    BaseButton: {
                      style: {
                        marginTop: "10px",
                        marginLeft: "5px",
                        paddingRight: "4rem",
                        paddingLeft: "4rem",
                      }
                    }
                  }}
                >
                  {intl.save}
                </Button>
                <Button
                  type="button"
                  overrides={{
                    BaseButton: {
                      style: {
                        marginTop: "10px",
                        paddingRight: "4rem",
                        paddingLeft: "4rem",
                      }
                    }
                  }}
                  onClick={() => {
                    formikProps.resetForm();
                  }}
                >
                  {intl.abort}
                </Button>

                {responseMessage && (
                  <Block marginRight="scale800" marginTop="10px">
                     <Notification kind="positive" autoHideDuration={5000}>
                        {responseMessage}
                     </Notification>
                  </Block>
                )}

                {errorMessage && (
                  <Block marginRight="scale800" marginTop="10px">
                    <Notification kind="negative">
                      {errorMessage}
                    </Notification>
                  </Block>
                )}
              </Block>
            </Form>
          )
        }
      </Formik>
    </React.Fragment>
  ) : (
    <React.Fragment>

    </React.Fragment>
  )
};

export default CreateDocument;
