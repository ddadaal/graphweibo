import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { HomepageLanguageSelector } from "src/pageComponents/Home/LanguageSelector";
import { Footer } from "src/pageComponents/Footer";
import { Button } from "antd";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  background-image:
    url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-position: center 110px;
  background-size: 100%;
`;

const Center = styled.div`
  padding: 32px;

  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

`;

const RowCenter = styled.div`
  text-align: center;
  margin: 8px;
`;

const Header = styled.div`
  a {
    text-decoration: none;
  }
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 500px;

  transform: translateY(-10%);
`;

const FormSection = styled.div`
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 32px;
  margin-bottom: 32px;
`;

interface Props {
  title?: React.ReactNode;
}

export const HomePageLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <Container>
        <Center>
          <Content>
            <Header>
              <Link href="/">
                <img width={"80%"} alt="logo" src={"/logo-horizontal.svg"} />
              </Link>
            </Header>
            <RowCenter>
              {title}
            </RowCenter>
            <FormSection>
              {children}
            </FormSection>
            <RowCenter>
              <HomepageLanguageSelector />
            </RowCenter>
          </Content>
        </Center>
      </Container >
      <Footer />
    </div>
  );
};

export const FormButton = styled(Button)`
  width: 100%;
`;
