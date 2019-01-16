import React from "react";
import PushableWrapper from "../../Common/PushableWrapper";
import styled from "styled-components";
import { View } from "react-native";

const Wrapper = styled.TouchableOpacity`
  margin: 20px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkView = styled.View`
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Subtitle = styled.Text`
  color: white;
  ${({ bold }) => bold && "font-weight: bold;"} margin-top: 5px;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.2;
`;

export default ({ game, navigate, text }) => {
  let image;
  if (game.current.images != null && game.current.images.length !== 0) {
    image = game.current.images[0].url;
  }
  return (
    <PushableWrapper style={{ height: 120 }}>
      <BackgroundImage source={{ uri: image }} />
      <Wrapper onPress={navigate}>
        <View>
          <Title>{text}</Title>
          <Subtitle>
            <Subtitle bold>Start: </Subtitle>
            {game.start.name}
          </Subtitle>
          <Subtitle>
            <Subtitle bold>End: </Subtitle>
            {game.end.name}
          </Subtitle>
          <Subtitle>
            <Subtitle bold>Current: </Subtitle>
            {game.current.name}
          </Subtitle>
        </View>
        <LinkView>
          <Title>{game.links}</Title>
          <Title>{game.links === 1 ? "Link" : "Links"}</Title>
        </LinkView>
      </Wrapper>
    </PushableWrapper>
  );
};
