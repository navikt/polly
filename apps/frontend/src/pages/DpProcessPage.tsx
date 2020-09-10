import * as React from "react";
import {useReducer} from "react";
import {Label1} from "baseui/typography";
import Button from "../components/common/Button";
import DpProcessModal from "../components/DpProcess/DpProcessModal";
import {dpProcessToFormValuesConverter} from "../api/DpProcessApi";

const DpProcessPage = () => {
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  // const dpProcessInitialValues: DpProcessFormValues

  return (
    <>
      <Label1>DpProcess!</Label1>
      <Button onClick={() => toggleModal()}>Create DpProcess</Button>
      <DpProcessModal isOpen={showModal} onClose={toggleModal} initialValues={dpProcessToFormValuesConverter({})}/>
    </>
  )
}

export default DpProcessPage
