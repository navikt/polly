import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from "react-router-dom";
import {DataProcessor, DataProcessorFormValues, TeamResource} from "../../constants";
import {convertDataProcessorToFormValues, deleteDataProcessor, getDataProcessor, updateDataProcessor} from "../../api/DataProcessorApi";
import {getResourceById, getResourcesByIds} from "../../api";
import {Block, BlockProps} from "baseui/block";
import {intl, theme} from "../../util";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import TextWithLabel from "../common/TextWithLabel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {H4} from "baseui/typography";
import {user} from "../../service/User";
import {Spinner} from "../common/Spinner";
import {boolToText} from "../common/Radio";
import {codelist} from "../../service/Codelist";
import {marginZero} from "../common/Style";
import Button from "../common/Button";
import DataProcessorModal from "./DataProcessorModal";
import {DeleteDataProcessorModal} from "./DeleteDataProcessorModal";

const blockProps: BlockProps = {
  font: "ParagraphMedium",
  $style: {whiteSpace: 'pre-wrap', ...marginZero},
  display: "flex"
}
const DataProcessorView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentDataProcessor, setCurrentDataProcessor] = useState<DataProcessor>()
  const [showEditDataProcessorModal, setShowEditDataProcessorModal] = useState<boolean>(false)
  const [showDeleteDataProcessorModal, setShowDeleteDataProcessorModal] = useState<boolean>(false)
  const [contractOwner, setContractOwner] = useState<TeamResource>()
  const [operationalContractManagers, setOperationalContractManagers] = useState<TeamResource[]>([])
  const [modalErrorMessage,setModalErrorMessage] = useState<string>()
  const hasAccess = () => user.canWrite()
  const history = useHistory()
  const params = useParams<{ id?: string }>()
  const dividerDistance = theme.sizing.scale2400

  const handleEditDataProcessor = (dataProcessor: DataProcessorFormValues) => {
    if (!dataProcessor) return
    try {
      (async () => {
        const newDataProcessor = await updateDataProcessor(dataProcessor)
        setIsLoading(true)
        setCurrentDataProcessor(await getDataProcessor(newDataProcessor.id))
        setIsLoading(false)
      })()
      setShowEditDataProcessorModal(false)
    } catch (err) {
      setModalErrorMessage(err.response.data.message)
    }
  }

  const handleDeleteDataProcessor = async (dataProcessor: DataProcessor) => {
    try {
      await deleteDataProcessor(dataProcessor.id)
      history.push("/dataProcessor/")
      return true
    } catch (err) {
      setModalErrorMessage(err.response.data.message)
      return false
    }
  }

  useEffect(() => {
    (async () => {
      if (params.id) {
        setIsLoading(true)
        setCurrentDataProcessor(await getDataProcessor(params.id))
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (currentDataProcessor?.contractOwner) {
        setIsLoading(true)
        setContractOwner(await getResourceById(currentDataProcessor?.contractOwner))
        setIsLoading(false)
      }
      if (currentDataProcessor?.operationalContractManagers) {
        setIsLoading(true)
        setOperationalContractManagers(await getResourcesByIds(currentDataProcessor.operationalContractManagers))
        setIsLoading(false)
      }
    })()
  }, [currentDataProcessor])


  return (
    <>
      <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
        <H4 marginTop="0">{currentDataProcessor?.name}</H4>
        <Block marginTop={'auto'}>
          {hasAccess() && (
            <>
              <Button
                kind="outline"
                onClick={() => setShowEditDataProcessorModal(true)}
              >
                <FontAwesomeIcon icon={faEdit}/>&nbsp;{intl.edit}
              </Button>
              <Button
                kind="outline"
                onClick={() => {
                  setShowDeleteDataProcessorModal(true)
                }}
                marginLeft={true}
              >
                <FontAwesomeIcon icon={faTrash}/>&nbsp;{intl.delete}
              </Button>
            </>
          )}
        </Block>
      </Block>
      {
        !isLoading ? (currentDataProcessor &&
          <Block display="flex" marginBottom="1rem">
            <>{console.log(currentDataProcessor)}</>
            <Block width="40%" paddingRight={dividerDistance}>
              <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                <FlexGridItem>
                  <TextWithLabel label={intl.contract} text={currentDataProcessor.contract ? currentDataProcessor.contract : intl.notFilled}/>
                </FlexGridItem>
                <FlexGridItem>
                  <TextWithLabel label={intl.contractOwner} text={currentDataProcessor.contractOwner ? contractOwner?.fullName : intl.notFilled}/>
                </FlexGridItem>
                <FlexGridItem>
                  <TextWithLabel label={intl.operationalContractManagers}
                                 text={currentDataProcessor.operationalContractManagers.length > 0 ? operationalContractManagers.map(r => r.fullName).join(", ") : intl.notFilled}/>
                </FlexGridItem>
              </FlexGrid>
            </Block>
            <Block width="60%" paddingLeft={dividerDistance} $style={{borderLeft: `1px solid ${theme.colors.mono600}`}}>
              <FlexGrid flexGridColumnCount={1} flexGridRowGap={theme.sizing.scale800}>
                <FlexGridItem>
                  <TextWithLabel label={intl.note} text={currentDataProcessor.note ? currentDataProcessor.note : intl.notFilled}/>
                </FlexGridItem>
                <FlexGridItem>
                  <TextWithLabel label={intl.contractOwner} text={currentDataProcessor.contractOwner ? contractOwner?.fullName : intl.notFilled}/>
                </FlexGridItem>
                <FlexGridItem>
                  <TextWithLabel label={intl.dataProcessor} text={""}>
                    <Block {...blockProps}>
                      {currentDataProcessor?.outsideEU === null && intl.unclarified}
                      {currentDataProcessor.outsideEU === false && intl.no}
                    </Block>
                    <>
                      {currentDataProcessor.outsideEU &&
                      <Block>
                        <Block {...blockProps}>
                          <span>{intl.isDataProcessedOutsideEUEEA} </span>
                          <span>{boolToText(currentDataProcessor.outsideEU)}</span>
                        </Block>
                        {currentDataProcessor.outsideEU &&
                        <>
                          <Block {...blockProps}>
                            <span>{intl.transferGroundsOutsideEUEEA}: </span>
                            {currentDataProcessor.transferGroundsOutsideEU && <span>{codelist.getShortnameForCode(currentDataProcessor.transferGroundsOutsideEU)} </span>}
                            {!currentDataProcessor.transferGroundsOutsideEU && <span>{intl.emptyMessage} </span>}
                            {currentDataProcessor.transferGroundsOutsideEUOther && <span>: {currentDataProcessor.transferGroundsOutsideEUOther}</span>}
                          </Block>
                          {currentDataProcessor.countries && !!currentDataProcessor?.countries.length && <Block {...blockProps}>
                            <span>{intl.countries}: </span>
                            <span>{currentDataProcessor.countries.map(c => codelist.countryName(c)).join(', ')}</span>
                          </Block>}
                        </>
                        }
                      </Block>}
                    </>
                  </TextWithLabel>
                </FlexGridItem>
              </FlexGrid>
              <DataProcessorModal
                title={intl.dataProcessor}
                isOpen={showEditDataProcessorModal}
                initialValues={convertDataProcessorToFormValues(currentDataProcessor)}
                submit={handleEditDataProcessor}
                errorMessage={modalErrorMessage}
                onClose={() => setShowEditDataProcessorModal(false)}
              />
              <DeleteDataProcessorModal
                isOpen={showDeleteDataProcessorModal}
                dataProcessor={currentDataProcessor}
                submitDeleteDataProcessor={handleDeleteDataProcessor}
                onClose={() => setShowDeleteDataProcessorModal(false)}
                errorDataProcessorModal={modalErrorMessage}/>
            </Block>
          </Block>) : <Spinner size={theme.sizing.scale1200}/>
      }
    </>
  )
}

export default DataProcessorView
