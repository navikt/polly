import * as React from 'react'
import { useEffect, useReducer, useState } from 'react'
import Button from '../components/common/Button'
import DpProcessModal from '../components/DpProcess/DpProcessModal'
import { createDpProcess, dpProcessToFormValues, getAllDpProcesses } from '../api/DpProcessApi'
import { DpProcess, DpProcessFormValues } from '../constants'
import DpProcessTable from '../components/DpProcess/DpProcessTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Block } from 'baseui/block'
import { HeadingMedium } from 'baseui/typography'
import { user } from '../service/User'
import { useNavigate } from 'react-router-dom'
import { Spinner } from 'baseui/spinner'
import {ampli} from '../service/Amplitude'

const DpProcessPage = () => {
  const [showModal, toggleModal] = useReducer((prevState) => !prevState, false)
  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')
  const [dpProcesses, setDpProcesses] = useState<DpProcess[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  ampli.logEvent('besøk', {side: 'NAV som databehandler', url: '/dpprocess', app: 'Behandlingskatalogen'})

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      let processes = await getAllDpProcesses()
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
      navigate(`/dpprocess/${response.id}`)
      toggleModal()
    } catch (err: any) {
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal('Databehandlingen eksisterer allerede')
        return
      }
      setErrorDpProcessModal(err.response.data.message)
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <HeadingMedium marginTop="0">Behandlinger hvor NAV er databehandler</HeadingMedium>
        <div>
          {user.canWrite() /*!env.disableDpProcess &&*/ && (
            <Button kind="outline" onClick={() => toggleModal()}>
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;Opprett ny behandling
            </Button>
          )}
        </div>
      </div>
      <DpProcessModal isOpen={showModal} onClose={toggleModal} initialValues={dpProcessToFormValues({})} submit={handleCreateDpProcess} errorOnCreate={errorDpProcessModal} />
      {!isLoading ? <DpProcessTable dpProcesses={dpProcesses} /> : <Spinner $size={30} />}
    </>
  )
}

export default DpProcessPage
