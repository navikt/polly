import React, {useEffect, useReducer, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {DpProcess, DpProcessFormValues} from '../../constants';
import {deleteDpProcess, dpProcessToFormValues, getDpProcess, updateDpProcess} from '../../api/DpProcessApi';
import {StyledSpinnerNext} from 'baseui/spinner';
import {Block} from 'baseui/block';
import {H4} from "baseui/typography";
import {intl} from "../../util";
import {DotTags} from "../common/DotTag";
import DataText from "../common/DataText";
import {codelist, ListName} from "../../service/Codelist";
import {TeamList} from "../common/Team";
import {RetentionView} from "../Process/Retention";
import {shortenLinksInText} from "../../util/helper-functions";
import {ActiveIndicator} from "../common/Durations";
import {boolToText} from "../common/Radio";
import RouteLink from "../common/RouteLink";
import Button from "../common/Button";
import DpProcessModal from "./DpProcessModal";
import {DpProcessDeleteModal} from "./DpProcessDeleteModal";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {SIZE as ButtonSize} from "baseui/button";
import {user} from "../../service/User";

const DpProcessView = () => {
  const history = useHistory()
  const params = useParams<{id?: string}>()
  const [dpProcess, setDpProcess] = useState<DpProcess>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [showModal, toggleModal] = useReducer(prevState => !prevState, false)
  const [showDeleteModal, toggleDeleteModal] = useReducer(prevState => !prevState, false)

  const [errorDpProcessModal, setErrorDpProcessModal] = React.useState<string>('')

  const isSubDataProcessorAgreementsAvailable = !!dpProcess?.subDataProcessing?.dataProcessorAgreements.length
  const isDataProcessingAgreementsAvailable = !!dpProcess?.dataProcessingAgreements.length

  const handleEditDpProcess = async (dpProcess: DpProcessFormValues) => {
    if (!dpProcess) return
    try {
      if (dpProcess.id) {
        const updatedDpProcess = await updateDpProcess(dpProcess.id, dpProcess)
        setDpProcess(updatedDpProcess)
      }
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

  const handleDeleteDpProcess = async (id?: string) => {
    try {
      if (id) {
        await deleteDpProcess(id)
        setErrorDpProcessModal('')
        toggleModal()
        history.push(`/dpprocess`)
      }
    } catch (err) {
      console.log(err.response)
      if (err.response.data.message.includes('already exists')) {
        setErrorDpProcessModal(intl.dpProcessDuplicatedError)
        return
      }
      setErrorDpProcessModal(err.response.data.message)
    }
  }

  useEffect(() => {
    (async () => {
      if (params.id) {
        setLoading(true)
        setDpProcess(await getDpProcess(params.id))
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      {!isLoading ? (
        <>
          <Block display="flex" justifyContent={"space-between"} alignItems={"center"}>
            <H4>{dpProcess?.name}</H4>
            {user.canWrite() && /*!env.disableDpProcess &&*/
            <Block>
              <Button size="compact" kind="outline" tooltip={intl.edit} icon={faEdit} marginRight onClick={toggleModal}>
                {intl.edit}
              </Button>
              <Button size={ButtonSize.compact} kind='outline' onClick={toggleDeleteModal} tooltip={intl.delete} icon={faTrash}>
                {intl.delete}
              </Button>
            </Block>
            }
          </Block>

          <DataText label={intl.externalProcessResponsible} text={""}>
            <span>{!!dpProcess?.externalProcessResponsible ?
              <RouteLink href={`/thirdparty/${dpProcess.externalProcessResponsible.code}`}>
                {codelist.getShortnameForCode(dpProcess.externalProcessResponsible)}
              </RouteLink>
              : intl.no}</span>
          </DataText>

          <DataText label={intl.description} text={dpProcess?.description}/>

          <DataText label={intl.purpose} text={dpProcess?.purposeDescription}/>

          <DataText label={intl.validityOfProcess} text={""}>
            <ActiveIndicator alwaysShow={true} showDates={true} {...dpProcess} />
          </DataText>

          <DataText label={intl.article9} text={boolToText(dpProcess?.art9)}/>
          <DataText label={intl.article10} text={boolToText(dpProcess?.art10)}/>

          <DataText label={intl.system} text={""}>
            {dpProcess && (<DotTags list={ListName.SYSTEM} codes={dpProcess.affiliation.products} linkCodelist/>)}
          </DataText>

          <DataText label={intl.organizing} text={""}>
            {dpProcess?.affiliation.department ? <Block>
              <span>{intl.department}: </span>
              <span><DotTags list={ListName.DEPARTMENT} codes={[dpProcess?.affiliation.department]} commaSeparator linkCodelist/> </span>
            </Block> : <span>{intl.department}: {intl.notFilled}</span>}
            {!!dpProcess?.affiliation.subDepartments.length ? <Block>
                <Block display="flex">
                  <span>{intl.subDepartment}: </span>
                  <DotTags list={ListName.SUB_DEPARTMENT} codes={dpProcess?.affiliation.subDepartments} linkCodelist/>
                </Block>
              </Block> :
              <Block display="flex">
                <span>{intl.subDepartment}: {intl.notFilled}</span>
              </Block>
            }

            <Block display="flex">
              <span>{intl.productTeam}: </span>
              {!!dpProcess?.affiliation.productTeams?.length ? <TeamList teamIds={dpProcess?.affiliation.productTeams}/> : intl.notFilled}
            </Block>
          </DataText>
          <DataText label={intl.retention} text={""}>
            <>
              {dpProcess?.retention?.retentionPlan === null && intl.retentionPlanUnclarified}
              {dpProcess?.retention?.retentionPlan === false && intl.retentionPlanNo}
            </>
            <>
              {dpProcess?.retention?.retentionPlan &&
              <Block>
                <Block>{intl.retentionPlanYes}</Block>
              </Block>
              }
              <Block>
                <RetentionView retention={dpProcess?.retention}/>
              </Block>
              <Block>
                <span>{dpProcess?.retention?.retentionDescription && `${intl.retentionDescription}: `}</span>
                {dpProcess?.retention?.retentionDescription && shortenLinksInText(dpProcess?.retention?.retentionDescription)}
              </Block>
            </>
          </DataText>
          <DataText label={intl.dpProcessDataProcessor} text={""}>
            <>
              <Block>
                <Block>
                  {isDataProcessingAgreementsAvailable &&
                  <Block display='flex' alignItems="center">
                    <Block $style={{whiteSpace: 'nowrap', margin: '1rem 0'}}>
                      {`${intl.dataProcessorAgreement}: `}
                    </Block>
                    <DotTags items={dpProcess?.dataProcessingAgreements} markdown/>
                  </Block>
                  }
                </Block>
              </Block>
            </>
          </DataText>

          <DataText label={intl.subDataProcessor} text={""}>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor === null && intl.dataProcessorUnclarified}
              {dpProcess?.subDataProcessing?.dataProcessor === false && intl.dataProcessorNo}
            </>
            <>
              {dpProcess?.subDataProcessing?.dataProcessor &&
              <Block>
                <Block>{intl.dataProcessorYes}</Block>
                <Block>
                  {isSubDataProcessorAgreementsAvailable &&
                  <Block display='flex' alignItems="center">
                    <Block $style={{whiteSpace: 'nowrap', margin: '1rem 0'}}>
                      {`${intl.dataProcessorAgreement}: `}
                    </Block>
                    <DotTags items={dpProcess?.subDataProcessing.dataProcessorAgreements} markdown/>
                  </Block>
                  }
                </Block>
                <Block>
                  <span>{intl.isDataProcessedOutsideEUEEA} </span>
                  <span>{boolToText(dpProcess?.subDataProcessing.dataProcessorOutsideEU)}</span>
                </Block>
                {dpProcess?.subDataProcessing.dataProcessorOutsideEU &&
                <>
                  <Block>
                    <span>{intl.transferGroundsOutsideEUEEA}: </span>
                    {dpProcess?.subDataProcessing.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(dpProcess?.subDataProcessing.transferGroundsOutsideEU)} </span>}
                    {!dpProcess?.subDataProcessing.transferGroundsOutsideEU && <span>{intl.emptyMessage} </span>}
                    {dpProcess?.subDataProcessing.transferGroundsOutsideEUOther && <span>: {dpProcess?.subDataProcessing.transferGroundsOutsideEUOther}</span>}
                  </Block>
                  {!!dpProcess?.subDataProcessing?.transferCountries.length && <Block>
                    <span>{intl.countries}: </span>
                    <span>{dpProcess?.subDataProcessing.transferCountries.map(c => codelist.countryName(c)).join(', ')}</span>
                  </Block>}
                </>
                }
              </Block>}
            </>
          </DataText>
          <DpProcessModal
            isOpen={showModal}
            onClose={toggleModal}
            initialValues={dpProcessToFormValues(dpProcess ? dpProcess : {})}
            submit={handleEditDpProcess}
            errorOnCreate={errorDpProcessModal}
          />
          <DpProcessDeleteModal
            title={intl.confirmDeleteHeader}
            isOpen={showDeleteModal}
            onClose={toggleDeleteModal}
            onSubmit={() => handleDeleteDpProcess(dpProcess?.id)}
            errorOnDeletion={errorDpProcessModal}
          />
        </>
      ) : (
        <StyledSpinnerNext/>
      )}
    </>
  )
}

export default DpProcessView
