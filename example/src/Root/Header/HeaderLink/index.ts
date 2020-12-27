import { NavLink } from 'pre-router';
import styled from 'styled-components';

export const HeaderLink = styled(NavLink)`
  color: black;
  font-size: 20px;
  text-decoration: none;

  &.active {
    color: indigo;
  }

  & ~ & {
    padding-left: 16px;
  }
`;
