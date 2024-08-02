import { Cell, HeadCell, Row, Table } from '../common/Table'

type AAregHjemmelDataTextProps = {
  data: string
}

export const AAregHjemmelDataText = (props: AAregHjemmelDataTextProps) => {
  const { data } = props
  const rawData: string[] = data ? prepareString(data).split('\n') : []

  const purposeList: string[] = rawData.filter((data) => data.match('Formål:')).map((purpose) => purpose.replace('Formål:', ''))
  const authoryList: string[] = rawData.filter((data) => data.match('Hjemmel:')).map((authory) => authory.replace('Hjemmel:', ''))
  const processorList: string[] = rawData.filter((data) => data.match('Behandlingsgrunnlag:')).map((processor) => processor.replace('Behandlingsgrunnlag:', ''))

  return (
    <div>
      <Table
        emptyText="Ikke angitt"
        headers={
          <>
            <HeadCell title="Formål med behandlingen" />
            <HeadCell title="NAVs hjemmel for utlevering" />
            <HeadCell title="Konsumentens hjemmel for behandlingen" />
          </>
        }
      >
        {purposeList.map((aaRegister: string, index: number) => (
          <Row key={aaRegister + '_' + index}>
            <Cell>
              <div>{aaRegister}</div>
            </Cell>
            <Cell>
              <div>{authoryList[index]}</div>
            </Cell>
            <Cell>
              <div>{processorList[index]}</div>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  )
}
export default AAregHjemmelDataText

const prepareString = (text: string): string => {
  return text.replace('\n\n', ' ').replace('\n\n\n', ' ')
}
