import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: #f4f4f4;
  padding: 30px;
  text-align: center;
  font-size: 14px;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      © {new Date().getFullYear()} Mentor Craft. All rights reserved.
    </FooterWrapper>
  );
};

export default Footer;
