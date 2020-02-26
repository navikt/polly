import React from "react";
import {Tabs, TabsProps} from "baseui/tabs";
import {theme} from "../../util";
import {paddingAll, paddingZero} from "./Style";

const TabsContext = React.createContext<Partial<TabsProps>>({});

export const CustomizedTabs = (props: TabsProps) => {
  return(
    <TabsContext.Provider value={props}>
      <Tabs
        onChange={props.onChange}
        activeKey={props.activeKey}
        overrides={{
          Root: {
            style: {
              outline: `4px ${theme.colors.primary200} solid`
            }
          },
          TabContent: {
            style: paddingZero
          },
          TabBar: {
            style: {
              ...paddingAll(theme.sizing.scale600)
            }
          }
        }}
      >
        {props.children}
      </Tabs>
    </TabsContext.Provider>
  )
}
