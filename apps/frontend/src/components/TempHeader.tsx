import * as React from 'react';
import {
    HeaderNavigation,
    ALIGN,
    StyledNavigationItem as NavigationItem,
    StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';


const TempHeader = () => (
    <HeaderNavigation
        overrides={{
            Root: {
                style: ({ $theme }) => {
                    return {
                        padding: '1rem'
                    };
                }
            }
        }}
    >
        <Block margin="0 auto" width="80%">
            <NavigationList $align={ALIGN.right}>
                <NavigationItem>
                    <Button>Logg inn</Button>
                </NavigationItem>
            </NavigationList>
        </Block>

    </HeaderNavigation>
);

export default TempHeader