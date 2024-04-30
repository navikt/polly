import React, { useEffect, useState } from 'react'
import { AaregAvtale } from '../../constants'
import { PLACEMENT, StatefulPopover } from 'baseui/popover'
import { StatefulMenu } from 'baseui/menu'
import { Block } from 'baseui/block'
import { theme } from '../../util'
import Button from '../common/Button'
import { KIND } from 'baseui/button'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Pagination } from 'baseui/pagination'
import { HeadingLarge, LabelLarge } from 'baseui/typography'
import { Panel, StatelessAccordion } from 'baseui/accordion'
import DataText from '../common/DataText'
import AAregHjemmelDataText from './AAregHjemmelDataText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type AaregAvtaleTableProps = {
  aaregAvtaler: AaregAvtale[]
}

const marginBottom = '1rem'
const marginTop = '2rem'

const CustomPanelLabel = ({ text }: { text: any }) => {
  return (
    <Block width="100%" marginBottom={marginBottom} $style={{ boderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: '#AFAFAF' }}>
      <LabelLarge marginTop={marginTop}>{text}</LabelLarge>
    </Block>
  )
}

export const sortAaregAvtaleList = (aaregAvtaler: AaregAvtale[]) => {
  return aaregAvtaler.sort((a, b) => {
    if (a.virksomhet > b.virksomhet) {
      return 1
    } else if (a.virksomhet < b.virksomhet) {
      return -1
    } else {
      if (a.avtalenummer > b.avtalenummer) {
        return 1
      } else if (a.avtalenummer < b.avtalenummer) {
        return -1
      } else {
        return 0
      }
    }
  })
}

export const AaregAvtaleTable = (props: AaregAvtaleTableProps) => {
  const [pageLimit, setPageLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [sortedAaregAvtale, setSortedAaregAvtale] = useState<AaregAvtale[]>([])
  const [selectedAaregAvtale, setSelectedAaregAvtale] = useState<string>()

  useEffect(() => {
    setSortedAaregAvtale(sortAaregAvtaleList(props.aaregAvtaler).slice(0, 10))
  }, [props.aaregAvtaler])

  useEffect(() => {
    setSortedAaregAvtale(sortAaregAvtaleList(props.aaregAvtaler).slice((page - 1) * pageLimit, pageLimit * page))
  }, [pageLimit, page])

  return (
    <>
      <HeadingLarge>Utleveringsavtaler i Aa-registeret</HeadingLarge>
      <StatelessAccordion
        onChange={({ expanded }) => {
          setSelectedAaregAvtale(expanded[0] as string)
        }}
        expanded={selectedAaregAvtale ? [selectedAaregAvtale] : []}
      >
        {sortedAaregAvtale &&
          sortedAaregAvtale.map((a) => {
            const expanded = selectedAaregAvtale === a.avtalenummer
            return (
              <Panel
                key={a.avtalenummer}
                title={
                  <Block width="100%">
                    <LabelLarge color={theme.colors.primary}>
                      {expanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
                      <span> </span>
                      <span>
                        {a.virksomhet} - (Avtalenummer-{a.avtalenummer.replace('AVT-', '')})
                      </span>
                    </LabelLarge>
                  </Block>
                }
                overrides={{
                  ToggleIcon: {
                    component: () => null,
                  },
                  Content: {
                    style: {
                      backgroundColor: theme.colors.white,
                      // Outline width
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                    },
                  },
                }}
              >
                <Block
                  $style={{
                    outline: `4px ${theme.colors.primary200} solid`,
                  }}
                >
                  <Block paddingBottom={theme.sizing.scale800} paddingLeft={theme.sizing.scale800} paddingRight={theme.sizing.scale800} paddingTop={theme.sizing.scale800}>
                    <CustomPanelLabel text='Konsument' />
                    <DataText label='Navn' text={a.virksomhet || 'Ikke angitt'} />
                    <DataText label='Organisasjonsnummer' text={a.organisasjonsnummer || 'Ikke angitt'} />

                    <CustomPanelLabel text='Avtale' />
                    <DataText label='Avtalenummer' text={a.avtalenummer || 'Ikke angitt'} />
                    <DataText label='Dato opprettet' text={a.opprettet || 'Ikke angitt'} />

                    <CustomPanelLabel text='Formål, Hjemmel og Behandlingsgrunnlag' />

                    <AAregHjemmelDataText data={a.hjemmel_behandlingsgrunnlag_formal} />

                    <CustomPanelLabel text='Type tilgang' />
                    <DataText label='API' text={a.integrert_oppslag_api ? 'Tilgjengelig' : 'Ikke tilgjengelig'} />
                    <DataText label='Uttrekk' text={a.uttrekk ? 'Tilgjengelig' : 'Ikke tilgjengelig'} />
                    <DataText label='Web-oppslag' text={a.web_oppslag ? 'Tilgjengelig' : 'Ikke tilgjengelig'} />
                    <DataText label='Hendelser' text={a.hendelser ? 'Tilgjengelig' : 'Ikke tilgjengelig'} />

                    <CustomPanelLabel text='Databehandler' />
                    <DataText label='Organisasjonsnummer' text={a.databehandler_organisasjonsnummer || 'Ikke angitt'} />
                    <DataText label='Navn' text={a.databehandler_navn || 'Ikke angitt'} />
                  </Block>
                </Block>
              </Panel>
            )
          })}
      </StatelessAccordion>

      <Block display="flex" justifyContent="space-between" marginTop="1rem">
        <StatefulPopover
          placement={PLACEMENT.bottom}
          content={({ close }) => (
            <StatefulMenu
              items={[5, 10, 20, 50, 100].map((i) => ({ label: i }))}
              onItemSelect={({ item }) => {
                setPageLimit(item.label)
                close()
              }}
              overrides={{
                List: {
                  style: { height: '150px', width: '100px' },
                },
              }}
            />
          )}
        >
          <div>
            <Button kind={KIND.tertiary} iconEnd={faChevronDown}>{`${pageLimit} Rader`}</Button>
          </div>
        </StatefulPopover>
        <Pagination
          currentPage={page}
          numPages={Math.ceil(props.aaregAvtaler.length / pageLimit)}
          onPageChange={(a) => setPage(a.nextPage)}
          labels={{ nextButton: 'Neste', preposition: 'av', prevButton: 'Forrige' }}
        />
      </Block>
    </>
  )
}

export default AaregAvtaleTable
