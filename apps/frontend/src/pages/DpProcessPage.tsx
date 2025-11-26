import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createDpProcess, dpProcessToFormValues, getAllDpProcesses } from '../api/DpProcessApi'
import DpProcessModal from '../components/DpProcess/DpProcessModal'
import DpProcessTable from '../components/DpProcess/DpProcessTable'
import Button from '../components/common/Button/CustomButton'
import { IDpProcess, IDpProcessFormValues } from '../constants'
import { user } from '../service/User'

const DpProcessPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [errorDpProcessModal, setErrorDpProcessModal] = useState<string>('')
  const [dpProcesses, setDpProcesses] = useState<IDpProcess[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const processes = await getAllDpProcesses()
      if (processes) {
        setDpProcesses(processes)
      }
      setLoading(false)
    })()
  }, [])

  const handleCreateDpProcess = async (dpProcess: IDpProcessFormValues) => {
    if (!dpProcess) return
    try {
      const response = await createDpProcess(dpProcess)
      setErrorDpProcessModal('')
      navigate(`/dpprocess/${response.id}`)
      setShowModal(false)
    } catch (error: any) {
      if (error.response.data.message.includes('already exists')) {
        setErrorDpProcessModal('Databehandlingen eksisterer allerede')
        return
      }
      setErrorDpProcessModal(error.response.data.message)
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <HeadingMedium marginTop="0">Behandlinger hvor NAV er databehandler</HeadingMedium>
        <div>
          {user.canWrite() /*!env.disableDpProcess &&*/ && (
            <Button kind="outline" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlusCircle} />
              &nbsp;Opprett ny behandling
            </Button>
          )}
        </div>
      </div>
      {showModal && (
        <DpProcessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialValues={dpProcessToFormValues({})}
          submit={handleCreateDpProcess}
          errorOnCreate={errorDpProcessModal}
        />
      )}
      {!isLoading ? <DpProcessTable dpProcesses={dpProcesses} /> : <Spinner $size={30} />}
    </>
  )
}

export default DpProcessPage
