import { Box } from "@mui/material";
import styled from "styled-components";

export const Row = styled(Box)`
  display: flex;
  align-items: center;
`;

export const Column = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const ScrollableContainer = styled(Column)<{ paddingBottom?: number }>`
  max-height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  padding-bottom: ${({ paddingBottom }) => paddingBottom || 0}px;
`;

export const FixedBottomButtonsContainer = styled(Column)`
  padding: 16px 16px 27px 16px;
  gap: 15px;
  width: 100%;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
`;
