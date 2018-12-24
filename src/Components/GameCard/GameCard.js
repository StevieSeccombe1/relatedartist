import React from "react";
import PushableWrapper from "../../Common/PushableWrapper";
import styled from "styled-components";
import { View } from "react-native";
import spotifyIcon from "../../Assets/spotify.png";

const Wrapper = styled.TouchableOpacity`
  background: ${({ theme }) => theme.cardBackground};
  padding: 10px;
  margin: 10px;
  border-radius: 6px;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Subtitle = styled.Text`
  color: white;
`;

const ImageWrapper = styled.View`
  border-radius: 6px;
  width: 50px;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const BackgroundImage = styled.Image`
  border-radius: 15px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export default ({ game, navigateToGame }) => {
  let image;
  if (game.current.images.length !== 0) {
    image = game.current.images[game.current.images.length - 1].url;
  }
  return (
    <PushableWrapper style={{ height: 100 }}>
      <Wrapper onPress={navigateToGame}>
        <View>
          <Title>
            {game.start.name} to {game.end.name}
          </Title>
          <Subtitle>
            Current Artist: <Title>{game.current.name}</Title>
          </Subtitle>
          <Subtitle>Links: {game.links}</Subtitle>
        </View>
        <ImageWrapper>
          <BackgroundImage source={{ uri: image } || spotifyIcon} />
        </ImageWrapper>
      </Wrapper>
    </PushableWrapper>
  );
};
