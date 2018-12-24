import React from "react";
import styled from "styled-components";
import { View, TouchableOpacity, Linking } from "react-native";
import PushableWrapper from "../../Common/PushableWrapper";

const Wrapper = styled.View`
  border-radius: 10px;
  margin: 10px 25px;
`;

const Title = styled.Text`
  color: white;
  font-weight: bold;
  font-size: ${({ large }) => (large ? 18 : 14)}px;
  align-self: flex-end;
`;

const CompanyTitle = styled(Title)`
  align-self: flex-start;
  font-size: 24px;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.2;
`;

const ContentWrapper = styled.View`
  padding: 20px;
  justify-content: space-between;
`;

export default ({ artist, image, title }) => {
  return (
    <PushableWrapper
      onPress={() => Linking.openURL(artist.external_urls.spotify)}
    >
      <Wrapper>
        <BackgroundImage source={{ uri: image }} />
        <ContentWrapper>
          <View>
            <CompanyTitle>{title}</CompanyTitle>
          </View>
          <View>
            <Title large adjustsFontSizeToFit numberOfLines={1}>
              {artist.name}
            </Title>
            <Title>Click to play on Spotify</Title>
          </View>
        </ContentWrapper>
      </Wrapper>
    </PushableWrapper>
  );
};
