import React from "react";
import styled from "styled-components";
import PushableWrapper from "../../Common/PushableWrapper";
import Icon from "react-native-vector-icons/FontAwesome5";

const Wrapper = styled.View`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  flex: 1;
  margin: 10px 10px;
  padding: 10px;
  flex-direction: row
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 24px;
`;

export default ({ name, navigateToGame }) => {
  return (
    <PushableWrapper style={{ height: 75 }} onPress={navigateToGame}>
      <Wrapper>
        <Title>New {name} Game</Title>
        <Icon name="plus" size={24} color="#fff" />
      </Wrapper>
    </PushableWrapper>
  );
};
