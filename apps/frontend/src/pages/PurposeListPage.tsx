import {intl, theme, useAwait} from '../util'
import {codelist, ListName} from '../service/Codelist'
import {H4, Label1} from 'baseui/typography'
import React from 'react'
import {Block} from 'baseui/block'
import {Button, KIND, SIZE as ButtonSize} from 'baseui/button';
import {Plus} from 'baseui/icon';
import {user} from '../service/User';
import ModalProcess from '../components/Purpose/Accordion/ModalProcess';
import {ProcessFormValues} from '../constants';
import {convertProcessToFormValues, createProcess} from '../api';
import AlphabeticList from "../components/common/AlphabeticList";
import {RouteComponentProps} from 'react-router-dom'

export const PurposeListPage = (props: RouteComponentProps) => {
  useAwait(codelist.wait())

  const hasAccess = () => user.canWrite();
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)


  const handleCreateProcess = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
      props.history.push(`/process/purpose/${newProcess.purposeCode}/ALL/${newProcess.id}?create`)
    } catch (err) {
      setErrorProcessModal(err.message)
    }
  }

  return (
    <>
      <H4>{intl.processingActivities}</H4>

      <Block display={'flex'} width={'100%'} justifyContent={"space-between"}>
        <Block>
          <Label1>{intl.purposeSelect}</Label1>
        </Block>
        <Block marginTop={"auto"}>
          {hasAccess() && (
            <Button
              size={ButtonSize.compact}
              kind={KIND.minimal}
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
        initialValues={convertProcessToFormValues({purposeCode: ''})}
      />
      <AlphabeticList listName={ListName.PURPOSE} baseUrl={"/process/purpose/"}/>
    </>
  )
}
