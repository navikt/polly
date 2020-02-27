import * as React from 'react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Block } from 'baseui/block';
import { LightTheme } from 'baseui';
import SideBar from './SideBar';
import Routes from "../routes";

const narrowItemProps = {
  overrides: {
    Block: {
      style: ({$theme}: {$theme: typeof LightTheme}) => ({
        width: $theme.sizing.scale1600,
        flexGrow: 0,
      }),
    },
  },
};

const App = () => (
  <FlexGrid
    flexGridColumnCount={2}
    flexGridColumnGap="scale800"
    flexGridRowGap="scale800"
  >
    <FlexGridItem {...narrowItemProps}>
        <SideBar />
    </FlexGridItem>

    <FlexGridItem>
        <Block margin="0 auto" width="80%">
            <Routes />
        </Block>
    </FlexGridItem>
  </FlexGrid>
);

export default App
