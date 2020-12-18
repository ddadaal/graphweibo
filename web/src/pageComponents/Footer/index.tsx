import React from "react";
import styled from "styled-components";

const FooterComponent = styled.footer`
  display: flex;
  justify-content: center;
  /* width: 100%; */
  padding: 8px 32px;
  background-color: black;
  color: white;
`;

export const Footer: React.FC = () => {
  return (
    <FooterComponent>
      This is footer
    </FooterComponent>
  );
};
