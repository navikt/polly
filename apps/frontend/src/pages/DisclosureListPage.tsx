import React, { useEffect, useState } from 'react'
import { HeadingLarge, LabelMedium } from 'baseui/typography'
import { intl, theme } from '../util'
import { createDisclosure, DisclosureSummary, getAll, getDisclosureSummaries, getProcess } from '../api'
import { useQueryParam, useTable } from '../util/hooks'
import { Block } from 'baseui/block'
import { Button, Button as BButton, KIND } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { useNavigate } from 'react-router-dom'
import { lowerFirst } from 'lodash'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { ObjectLink } from '../components/common/RouteLink'
import { AaregAvtale, Disclosure, DisclosureFormValues, ObjectType, Process } from '../constants'
import { ListName } from '../service/Codelist'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { user } from '../service/User'
import { Plus } from 'baseui/icon'
import SearchProcess from '../components/common/SearchProcess'
import { checkForAaregDispatcher } from '../util/helper-functions'
import { searchAaregAvtale } from '../api/AaregAvtaleApi'
import { AaregAvtaleTable } from '../components/AaregAvtale/AaregAvtaleTable'
import {ampli} from "../service/Amplitude";

enum FilterType {
  legalbases = 'legalbases',
  emptylegalbases = 'emptylegalbases',
}

export const DisclosureListPage = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [newDisclosure, setNewDisclosure] = React.useState<Disclosure>()
  const [error, setError] = React.useState<string>()
  const [disclosures, setDisclosures] = useState<DisclosureSummary[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process>()
  const [table, sortColumn] = useTable<DisclosureSummary, keyof DisclosureSummary>(disclosures, {
    sorting: {
      name: (a, b) => a.name.localeCompare(b.name),
      legalBases: (a, b) => a.legalBases - b.legalBases,
      recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
      processes: (a, b) => a.processes.length - b.processes.length,
    },
    initialSortColumn: 'name',
  })
  const [aaregAvtaler, setAaregAvtaler] = useState<AaregAvtale[]>([])
  const [showAaregAvtaleTable, setShowAaregAvtaleTable] = useState<boolean>(false)
  const filter = useQueryParam<FilterType>('filter')
  const processFilter = useQueryParam<string>('process')
  const navigate = useNavigate()

  ampli.logEvent("besøk", {side: 'Utleveringer'})

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: '',
    recipientPurpose: '',
    description: '',
    document: undefined,
    legalBases: [],
    legalBasesOpen: false,
    start: undefined,
    end: undefined,
    processes: [],
    abroad: { abroad: false, countries: [], refToAgreement: '', businessArea: '' },
    processIds: [],
    administrationArchiveCaseNumber: '',
    assessedConfidentiality: undefined,
    confidentialityDescription: undefined
  }

  useEffect(() => {
    ;(async () => {
      const all = selectedProcess
        ? (await getAll(getDisclosureSummaries)()).filter((d) => d.processes.find((p) => p.id === selectedProcess.id))
        : await getAll(getDisclosureSummaries)()
      if (filter === FilterType.emptylegalbases) setDisclosures(all.filter((d) => !d.legalBases))
      else if (filter === FilterType.legalbases) setDisclosures(all.filter((d) => !!d.legalBases))
      else setDisclosures(all)
    })()
  }, [filter, newDisclosure, selectedProcess])

  useEffect(() => {
    ;(async () => {
      if (processFilter && processFilter.length >= 3) {
        const process = await getProcess(processFilter)
        if (process) {
          setSelectedProcess(process)
        }
      } else {
        setSelectedProcess(undefined)
      }
    })()
  }, [processFilter])

  useEffect(() => {
    ;(async () => {
      if ((selectedProcess && checkForAaregDispatcher(selectedProcess)) || showAaregAvtaleTable) {
        const res = await searchAaregAvtale('avt')
        setAaregAvtaler(res.content)
      }
    })()
  }, [selectedProcess, showAaregAvtaleTable])

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      setNewDisclosure(await createDisclosure(disclosure))
      setShowCreateModal(false)
    } catch (err: any) {
      setShowCreateModal(true)
      setError(err.message)
    }
  }

  const handleFilterChange = (url: string) => {
    if (selectedProcess) {
      return url + '&process=' + processFilter
    } else {
      return url
    }
  }

  return (
    <>
      <Block display="flex" justifyContent="space-between" alignItems="center">
        <HeadingLarge>{intl.disclosures}</HeadingLarge>
        <Block>
          <LabelMedium marginBottom={theme.sizing.scale600}>
            {intl.filter} {lowerFirst(intl.legalBasisShort)}
          </LabelMedium>
          <ButtonGroup selected={!filter ? 0 : filter === FilterType.legalbases ? 1 : 2} mode="radio" shape="pill">
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?'), {
                  replace: true,
                })
              }
            >
              {intl.all}
            </BButton>
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?filter=legalbases'), {
                  replace: true,
                })
              }
            >
              {intl.filled}
            </BButton>
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?filter=emptylegalbases'), {
                  replace: true,
                })
              }
            >
              {intl.incomplete}
            </BButton>
          </ButtonGroup>
        </Block>
      </Block>
      <Block display="flex" width="100%" marginBottom="12px">
        <Block display="flex" flex="1">
          <Block display="flex" flex="1">
            <SearchProcess selectedProcess={selectedProcess} setSelectedProcess={setSelectedProcess} />
          </Block>
          <Block marginLeft="8px" display="flex">
            <Button size="compact" onClick={() => setShowAaregAvtaleTable(!showAaregAvtaleTable)}>
              {' '}
              {showAaregAvtaleTable ? intl.hideAaregTable : intl.showAaregTable}
            </Button>
          </Block>
        </Block>
        <Block display="flex" flex="1" justifyContent="flex-end">
          {user.canWrite() && (
            <Button
              size="compact"
              kind={KIND.tertiary}
              onClick={() => setShowCreateModal(true)}
              startEnhancer={() => (
                <Block display="flex" justifyContent="center">
                  <Plus size={22} />
                </Block>
              )}
            >
              {intl.createNew}
            </Button>
          )}
        </Block>
      </Block>
      {!showAaregAvtaleTable && (
        <Table
          emptyText={intl.disclosures}
          headers={
            <>
              <HeadCell title={intl.disclosureName} column="name" tableState={[table, sortColumn]} />
              <HeadCell title={`${intl.recipient} (${intl.thirdParty})`} column="recipient" tableState={[table, sortColumn]} />
              <HeadCell title={intl.relatedProcesses} column="processes" tableState={[table, sortColumn]} />
              <HeadCell title={intl.legalBasesShort} column="legalBases" tableState={[table, sortColumn]} />
            </>
          }
        >
          {table.data.map((d) => (
            <Row key={d.id}>
              <Cell>
                <ObjectLink id={d.id} type={ObjectType.DISCLOSURE}>
                  {d.name}
                </ObjectLink>
              </Cell>
              <Cell>
                <ObjectLink id={d.recipient.code} type={ListName.THIRD_PARTY}>
                  {d.recipient.shortName}
                </ObjectLink>
              </Cell>
              <Cell>
                <Block display="flex" flexDirection="column">
                  {d.processes.map((p) => (
                    <Block key={p.id} marginRight={theme.sizing.scale400}>
                      <ObjectLink id={p.id} type={ObjectType.PROCESS}>
                        {p.purposes.map((pu) => pu.shortName).join(', ')}: {p.name}
                      </ObjectLink>
                    </Block>
                  ))}
                </Block>
              </Cell>
              <Cell>{d.legalBases ? intl.yes : intl.no}</Cell>
            </Row>
          ))}
        </Table>
      )}
      {((selectedProcess && checkForAaregDispatcher(selectedProcess)) || showAaregAvtaleTable) && (
        <Block marginTop="12px">
          <AaregAvtaleTable aaregAvtaler={aaregAvtaler} />
        </Block>
      )}
      <ModalThirdParty
        title={intl.createThirdPartyModalTitle}
        isOpen={showCreateModal}
        initialValues={initialFormValues}
        submit={handleCreateDisclosure}
        onClose={() => {
          setShowCreateModal(false)
          setError(undefined)
        }}
        errorOnCreate={error}
        disableRecipientField={false}
      />
    </>
  )
}
