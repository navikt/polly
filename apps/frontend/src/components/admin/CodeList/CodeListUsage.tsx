import { Button, Label, Loader, Select, Table } from '@navikt/ds-react'
import { ChangeEvent, RefObject, createRef, useEffect, useState } from 'react'
import { replaceCodelistUsage } from '../../../api/GetAllApi'
import {
  EObjectType,
  ICodeUsage,
  IDpProcessShort,
  IProcessShort,
  IUse,
  IUseWithPurpose,
} from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'
import { ObjectLink } from '../../common/RouteLink'

interface IProps {
  usage: ICodeUsage
}

const UsageTable = (props: IProps) => {
  const { usage } = props
  const informationTypes = !!usage.informationTypes.length
  const processes = !!usage.processes.length
  const processors = !!usage.processors.length
  const dpProcesses = !!usage.dpProcesses.length
  const policies = !!usage.policies.length
  const disclosures = !!usage.disclosures.length
  const documents = !!usage.documents.length

  const rows = usage
    ? Math.max(
        usage.informationTypes.length,
        usage.processes.length,
        usage.processors.length,
        usage.dpProcesses.length,
        usage.policies.length,
        usage.disclosures.length,
        usage.documents.length
      )
    : -1

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {informationTypes && <Table.ColumnHeader>Opplysningstype</Table.ColumnHeader>}
          {processes && <Table.ColumnHeader>Behandling</Table.ColumnHeader>}
          {processors && <Table.ColumnHeader>Databehandlere</Table.ColumnHeader>}
          {dpProcesses && <Table.ColumnHeader>NAV som databehandler</Table.ColumnHeader>}
          {policies && <Table.ColumnHeader>Polis</Table.ColumnHeader>}
          {disclosures && <Table.ColumnHeader>Utleveringer</Table.ColumnHeader>}
          {documents && <Table.ColumnHeader>Dokumenter</Table.ColumnHeader>}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from(Array(rows).keys()).map((index: number) => {
          const informationTypes: IUse = usage.informationTypes[index]
          const policies: IUseWithPurpose = usage.policies[index]
          const processes: IProcessShort = usage.processes[index]
          const processors: IUse = usage.processors[index]
          const dpProcesses: IDpProcessShort = usage.dpProcesses[index]
          const disclosures: IUse = usage.disclosures[index]
          const documents: IUse = usage.documents[index]

          return (
            <Table.Row key={index}>
              {informationTypes && (
                <Table.DataCell>
                  {informationTypes && (
                    <ObjectLink
                      id={informationTypes.id}
                      type={EObjectType.INFORMATION_TYPE}
                      withHistory={true}
                    >
                      {informationTypes.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {processes && (
                <Table.DataCell>
                  {processes && (
                    <ObjectLink id={processes.id} type={EObjectType.PROCESS} withHistory={true}>
                      {codelist
                        .getShortnames(
                          EListName.PURPOSE,
                          processes.purposes.map((purpose) => purpose.code)
                        )
                        .join(', ')}{' '}
                      {processes.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {processors && (
                <Table.DataCell>
                  {processes && (
                    <ObjectLink id={processors.id} type={EObjectType.PROCESSOR} withHistory={true}>
                      {processors.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {dpProcesses && (
                <Table.DataCell>
                  {dpProcesses && (
                    <ObjectLink
                      id={dpProcesses.id}
                      type={EObjectType.DP_PROCESS}
                      withHistory={true}
                    >
                      {dpProcesses.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {policies && (
                <Table.DataCell>
                  {policies && (
                    <ObjectLink id={policies.id} type={EObjectType.POLICY} withHistory={true}>
                      {codelist.getShortnames(EListName.PURPOSE, policies.purposes).join(', ')}{' '}
                      {policies.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {disclosures && (
                <Table.DataCell>
                  {disclosures && (
                    <ObjectLink
                      id={disclosures.id}
                      type={EObjectType.DISCLOSURE}
                      withHistory={true}
                    >
                      {disclosures.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
              {documents && (
                <Table.DataCell>
                  {documents && (
                    <ObjectLink id={documents.id} type={EObjectType.DOCUMENT} withHistory={true}>
                      {documents.name}
                    </ObjectLink>
                  )}
                </Table.DataCell>
              )}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

interface IUsageProps {
  usage?: ICodeUsage
  refresh: () => void
}

export const Usage = (props: IUsageProps) => {
  const { usage, refresh } = props
  const [showReplace, setShowReplace] = useState(false)
  const [newValue, setNewValue] = useState<string>()
  const ref: RefObject<HTMLDivElement> = createRef<HTMLDivElement>()

  useEffect(() => {
    setShowReplace(false)
    setTimeout(() => ref.current && window.scrollTo({ top: ref.current.offsetTop }), 200)
  }, [usage])

  const replace = async (): Promise<void> => {
    if (newValue && usage) {
      await replaceCodelistUsage(usage.listName, usage.code, newValue).then(() => refresh())
    }
  }

  return (
    <div className="mt-8" ref={ref}>
      <div className="flex justify-between mib-2">
        <Label>Bruk</Label>
        {!!usage?.inUse && (
          <Button type="button" variant="secondary" onClick={() => setShowReplace(true)}>
            Erstatt all bruk
          </Button>
        )}
      </div>

      {showReplace && usage && usage.listName && (
        <div className="flex m-4 justify-end">
          <Select
            label="Velg ny verdi"
            hideLabel
            className="mr-4"
            value={newValue}
            onChange={(params: ChangeEvent<HTMLSelectElement>) => setNewValue(params.target.value)}
          >
            <option value="">Ny verdi</option>
            {codelist.getParsedOptions(usage.listName).map((code, index: number) => (
              <option key={index + '_' + code.label} value={code.label}>
                {code.label}
              </option>
            ))}
          </Select>

          <Button type="button" onClick={replace} disabled={!newValue}>
            Erstatt
          </Button>
        </div>
      )}

      {usage && <UsageTable usage={usage} />}
      {!usage && <Loader />}
    </div>
  )
}
