import {intl, theme} from '../util'
import {H4, Label1} from 'baseui/typography'
import React from 'react'
import {Block} from 'baseui/block'
import {SIZE as ButtonSize} from 'baseui/button'
import {Plus} from 'baseui/icon'
import {user} from '../service/User'
import ModalProcess from '../components/Process/Accordion/ModalProcess'
import {ProcessFormValues} from '../constants'
import {convertDisclosureToFormValues, convertProcessToFormValues, createProcess, updateDisclosure} from '../api'
import {useHistory} from 'react-router-dom'
import {genProcessPath, Section} from './ProcessPage'
import Button from "../components/common/Button";
import {PurposeList} from './ListSearchPage'

export const PurposeListPage = () => {
  const history = useHistory()
  const hasAccess = () => user.canWrite()
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)


  const handleCreateProcess = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
      // todo multipurpose url
      history.push(genProcessPath(Section.purpose, newProcess.purposes[0].code, newProcess, undefined, true))
      process.disclosures.forEach(d=>{
        updateDisclosure(convertDisclosureToFormValues(
          {...d,processIds:[...d.processIds,newProcess.id?newProcess.id:'']}
        ))
      })
      return newProcess.id
    } catch (err) {
      setErrorProcessModal(err.message)
    }
  }

  return (
    <>
      <H4>{intl.processingActivities}</H4>

      <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <Block>
          <Label1>{intl.purposeSelect}</Label1>
        </Block>

        <Block marginTop={'auto'}>
          {hasAccess() && (
            <Button
              size={ButtonSize.compact}
              kind={'outline'}
              onClick={() => setShowCreateProcessModal(true)}
              startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
            >
              {intl.processingActivitiesNew}
            </Button>
          )}
        </Block>
      </Block>

      <Block marginBottom={theme.sizing.scale800}/>

      <ModalProcess
        title={intl.processingActivitiesNew}
        onClose={() => setShowCreateProcessModal(false)}
        isOpen={showCreateProcessModal}
        submit={(values: ProcessFormValues) => handleCreateProcess(values)}
        errorOnCreate={errorProcessModal}
        isEdit={false}
        initialValues={convertProcessToFormValues()}
      />
      <PurposeList/>
    </>
  )
}
