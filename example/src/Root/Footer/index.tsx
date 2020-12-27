import * as React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  height: 128px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  background-color: lightcoral;
`;

export const Footer: React.VFC = () => <Container>Example App</Container>;
