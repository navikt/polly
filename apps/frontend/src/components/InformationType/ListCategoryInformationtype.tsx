import * as React from "react";
import {CodeUsage} from "../../constants";
import RouteLink from "../common/RouteLink";
import {Block} from "baseui/block";
import {useStyletron} from "baseui";
import {Accordion, Panel} from "baseui/accordion";
import {ListItem, ListItemLabel} from "baseui/list";
import {intl, useAwait} from "../../util";
import {codelist, ListName} from "../../service/Codelist";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronRight} from "@fortawesome/free-solid-svg-icons";

type InformationTypeAccordionProps = {
    categoryUsages: CodeUsage[] | undefined
};

const InformationTypeAccordion = ({categoryUsages}: InformationTypeAccordionProps) => {
    const [css] = useStyletron();

    useAwait(codelist.wait())
    const panelList = () => {
        if (!categoryUsages) return
        return categoryUsages
            .filter(categoryUsage => categoryUsage.informationTypes.length > 0)
            .sort((a,b) => b.informationTypes.length - a.informationTypes.length)
            .map(categoryUsage => {
                return (
                    <Panel
                        title={
                            <Block display="flex" width="100%">
                                <Block marginRight="auto">{codelist.getShortname(ListName.CATEGORY, categoryUsage.code)}</Block>
                                <Block marginRight="50px">{intl.informationType}: {categoryUsage.informationTypes.length}</Block>
                            </Block>
                        }
                        overrides={{
                            Content: {
                                style: {
                                    backgroundColor: "transparent",
                                    paddingLeft: "0",
                                    paddingRight: "0",
                                }
                            },
                            ToggleIcon: {component: (iconProps) => !!iconProps.$expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
                        }}
                        key={categoryUsage.code}
                    >
                        <ul
                            className={css({
                                paddingLeft: 0,
                                paddingRight: 0,
                            })}
                        >
                            {categoryUsage.informationTypes.map((informationType) => {
                                return (
                                    <ListItem
                                        overrides={{
                                            Content:{
                                                style:{
                                                    height:"32px",
                                                }
                                            },
                                            ArtworkContainer:{},
                                            EndEnhancerContainer:{},
                                            Root:{}
                                        }}
                                        key={informationType.id}>
                                            <ListItemLabel>
                                                <RouteLink href={`/informationtype/${informationType.id}`}>{informationType.name}</RouteLink>
                                            </ListItemLabel>
                                    </ListItem>)
                            })}
                        </ul>
                    </Panel>
                )
            });
    };

    return (
        <Block width="800px" marginTop="50px">
            <Accordion>{panelList()}</Accordion>
        </Block>
    )
};

export default InformationTypeAccordion;