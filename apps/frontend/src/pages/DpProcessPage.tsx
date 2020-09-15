import * as React from "react";
import {useReducer} from "react";
import Button from "../components/common/Button";
import DpProcessModal from "../components/DpProcess/DpProcessModal";
import {createDpProcess, dpProcessToFormValues} from "../api/DpProcessApi";
import {DpProcessFormValues} from "../constants";
import {intl} from "../util";

const DpProcessPage = () => {
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')

  const handleCreateDpProcess = async (dpProcess: DpProcessFormValues) => {
    if (!dpProcess) return
    try {
      await createDpProcess(dpProcess)
      setErrorDpProcessModal('')
      toggleModal()
    } catch (err) {
      console.log(err.response)
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal(intl.dpProcessDuplicatedError)
        return
      }
      setErrorDpProcessModal(err.response.data.message)
    }
  }

  return (
    <>
      <Button onClick={() => toggleModal()}>{intl.createDpProcess}</Button>
      <DpProcessModal
        isOpen={showModal}
        onClose={toggleModal}
        initialValues={dpProcessToFormValues({})}
        submit={handleCreateDpProcess}
        errorOnCreate={errorDpProcessModal}
      />
    </>
  )
}

export default DpProcessPage
