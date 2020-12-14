import * as React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  padding: 64px;
  background-color: lightcoral;
  margin-top: 96px;
`;

export const Footer: React.VFC = () => <Container>Example App</Container>;
