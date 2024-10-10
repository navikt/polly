import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStyletron } from 'baseui'
import { Accordion, Panel } from 'baseui/accordion'
import { Heading, HeadingLevel } from 'baseui/heading'
import { ListItem, ListItemLabel } from 'baseui/list'
import { ParagraphLarge } from 'baseui/typography'
import { ICodeUsage, IUse } from '../../constants'
import { EListName, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import { useQueryParam } from '../../util/hooks'
import { toggleOverride } from '../common/Accordion'
import RouteLink from '../common/RouteLink'

type TInformationTypeAccordionProps = {
  categoryUsages: ICodeUsage[] | undefined
}

const ListCategoryInformationtype = ({ categoryUsages }: TInformationTypeAccordionProps) => {
  const [css] = useStyletron()
  const category = useQueryParam('category')
  const categoryNotInUse =
    !!category &&
    !categoryUsages?.filter((c) => c.code === category).flatMap((u) => u.informationTypes).length

  const panelList = () => {
    if (!categoryUsages) return
    return categoryUsages
      .filter((categoryUsage: ICodeUsage) => categoryUsage.informationTypes.length > 0)
      .sort((a, b) =>
        codelist
          .getShortname(a.listName, a.code)
          .localeCompare(codelist.getShortname(b.listName, b.code), 'nb')
      )
      .map((categoryUsage: ICodeUsage) => {
        return (
          <Panel
            title={
              <div className="flex w-full">
                <div className="min-w-[80%]">
                  {codelist.getShortname(EListName.CATEGORY, categoryUsage.code)}
                </div>
                <div className="mr-[50px] min-w-[20%] opacity-50 color-[#545454] text-sm">
                  Opplysningstyper: {categoryUsage.informationTypes.length}
                </div>
              </div>
            }
            overrides={{
              Content: {
                style: {
                  backgroundColor: 'transparent',
                  paddingLeft: '0',
                  paddingRight: '0',
                },
              },
              ToggleIcon: toggleOverride,
            }}
            key={categoryUsage.code}
          >
            <ul
              className={css({
                paddingLeft: 0,
                paddingRight: 0,
              })}
            >
              {categoryUsage.informationTypes
                .sort((a, b) => a.name.localeCompare(b.name, 'nb'))
                .map((informationType: IUse) => {
                  return (
                    <ListItem
                      overrides={{
                        Content: {
                          style: {
                            height: '40px',
                          },
                        },
                        ArtworkContainer: {},
                        EndEnhancerContainer: {},
                        Root: {},
                      }}
                      key={informationType.id}
                    >
                      <ListItemLabel>
                        <RouteLink href={`/informationtype/${informationType.id}`}>
                          {informationType.name}
                        </RouteLink>
                      </ListItemLabel>
                    </ListItem>
                  )
                })}
            </ul>
          </Panel>
        )
      })
  }

  return (
    <>
      {categoryNotInUse && (
        <ParagraphLarge marginBottom={theme.sizing.scale1200}>
          <FontAwesomeIcon icon={faExclamationTriangle} color={theme.colors.negative400} />
          <div className="mr-1.5 inline" />
          {`Kategori ${codelist.getShortname(EListName.CATEGORY, category!)} er ikke i bruk`}
        </ParagraphLarge>
      )}

      <div>
        <HeadingLevel>
          <Heading styleLevel={5} paddingLeft="20px">
            Kategorier
          </Heading>
        </HeadingLevel>
        <Accordion initialState={{ expanded: category ? [category] : [] }}>{panelList()}</Accordion>
      </div>
    </>
  )
}

export default ListCategoryInformationtype
