import * as React from "react";
import {useEffect, useReducer, useState} from "react";
import Button from "../components/common/Button";
import DpProcessModal from "../components/DpProcess/DpProcessModal";
import {createDpProcess, dpProcessToFormValues, getAllDpProcesses} from "../api/DpProcessApi";
import {DpProcess, DpProcessFormValues} from "../constants";
import {intl} from "../util";
import DpProcessTable from "../components/DpProcess/DpProcessTable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {Block} from "baseui/block";
import {H4} from "baseui/typography";
import {user} from "../service/User";
import {useHistory} from "react-router-dom";
import {StyledSpinnerNext} from "baseui/spinner";

const DpProcessPage = () => {
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')
  const [dpProcesses, setDpProcesses] = useState<DpProcess[]>([])
  const [isLoading,setLoading] = useState<boolean>(true)
  const history = useHistory()

  useEffect(() => {
    (async () => {
      setLoading(true)
      let processes = await getAllDpProcesses();
      if (processes) {
        setDpProcesses(processes)
      }
      setLoading(false)
    })()
  }, [])

  const handleCreateDpProcess = async (dpProcess: DpProcessFormValues) => {
    if (!dpProcess) return
    try {
      const response = await createDpProcess(dpProcess)
      setErrorDpProcessModal('')
      history.push(`/dpprocess/${response.id}`)
      toggleModal()
    } catch (err) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal(intl.dpProcessDuplicatedError)
        return
      }
      setErrorDpProcessModal(err.response.data.message)
    }
  }

  return (
    <>
      <Block display="flex" justifyContent="space-between">
        <H4 marginTop='0'>{intl.dpProcessPageTitle}</H4>
        <Block>
          {user.canWrite() && /*!env.disableDpProcess &&*/
          <Button kind="outline" onClick={() => toggleModal()}>
            <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createDpProcess}
          </Button>
          }
        </Block>
      </Block>
      <DpProcessModal
        isOpen={showModal}
        onClose={toggleModal}
        initialValues={dpProcessToFormValues({})}
        submit={handleCreateDpProcess}
        errorOnCreate={errorDpProcessModal}
      />
      {!isLoading ? <DpProcessTable dpProcesses={dpProcesses}/> : <StyledSpinnerNext size={30}/> }
    </>
  )
}

export default DpProcessPage
