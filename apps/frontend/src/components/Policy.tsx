import * as React from "react";
import { withStyle, useStyletron } from "baseui";
import {
    StyledTable,
    StyledHead,
    StyledHeadCell,
    StyledBody,
    StyledRow,
    StyledCell
} from "baseui/table";
import { Block, BlockProps } from "baseui/block";
import { Delete } from "baseui/icon";
import { Button, SIZE, KIND as BUTTONKIND, KIND } from "baseui/button";
import { Input, SIZE as ButtonSIZE } from "baseui/input";

const StyledBodyRow = withStyle(StyledRow, {
    backgroundColor: "transparent",
    borderBottom: "1px solid #E9E7E7",
    display: "flex",
    alignItems: "center",
    padding: "10px"
});

type TableProps = {
    policies: any | undefined;
    onRemovePolicy: Function;
};

const inputBlockProps: BlockProps = {
    width: "100%",
    marginRight: "2rem"
};

const Policy = ({ policies, onRemovePolicy }: TableProps) => {
    const [useCss, theme] = useStyletron();

    return (
        <React.Fragment>
            <StyledTable
                className={useCss({
                    marginBottom: "8rem",
                    overflow: "hidden !important"
                })}
            >
                <StyledHead>
                    <StyledHeadCell>Formål</StyledHeadCell>
                    <StyledHeadCell>Rettslig grunnlag</StyledHeadCell>
                    <StyledHeadCell></StyledHeadCell>
                </StyledHead>

                <StyledBody>
                    {policies
                        ? policies.map((row: any, index: number) => (
                              <StyledBodyRow key={index}>
                                  <StyledCell>{row.purpose.code}</StyledCell>

                                  <StyledCell>
                                      {row.legalBasisDescription}
                                  </StyledCell>

                                  <StyledCell>
                                      <Block
                                          width="100%"
                                          display="flex"
                                          justifyContent="flex-end"
                                      >
                                          <Button
                                              type="button"
                                              size={ButtonSIZE.compact}
                                              kind={BUTTONKIND.tertiary}
                                              onClick={() =>
                                                  onRemovePolicy(row.policyId)
                                              }
                                              overrides={{
                                                  BaseButton: {
                                                      style: ({ $theme }) => {
                                                          return {
                                                              backgroundColor:
                                                                  $theme.colors
                                                                      .warning300,
                                                              color: "white",
                                                              height: "2rem"
                                                          };
                                                      }
                                                  }
                                              }}
                                          >
                                              <Delete size={20} />
                                          </Button>
                                      </Block>
                                  </StyledCell>
                              </StyledBodyRow>
                          ))
                        : null}
                </StyledBody>
            </StyledTable>
        </React.Fragment>
    );
};

export default Policy;
