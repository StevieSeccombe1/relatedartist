import React from "react";
import styled from "styled-components";

const Wrapper = styled.View`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  margin: 10px 25px;
  align-items: center;
  flex-direction: row;
`;

const Title = styled.Text`
  color: white;
  font-weight: bold;
`;

const CompanyTitle = styled(Title)`
  font-size: 20px;
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

export default ({ start, end, links }) => {
  return (
    <Wrapper>
      <ContentWrapper>
        <CompanyTitle>{start.name}</CompanyTitle>
        <Title>to</Title>
        <CompanyTitle>{end.name}</CompanyTitle>
        <Title>{links} Links</Title>
      </ContentWrapper>
    </Wrapper>
  );
};
