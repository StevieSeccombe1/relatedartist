import React, { Component } from "react";
import styled from "styled-components";
import relatedIcon from "../../Assets/relatedIcon.png";
import { View } from "react-native";
import PushableWrapper from "../../Common/PushableWrapper";

const Wrapper = styled.TouchableOpacity`
  background: ${({ theme }) => theme.cardBackground};
  padding: 10px;
  margin: 10px;
  border-radius: 6px;
  flex: 1
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

class ResultCard extends Component {
  render() {
    const artist = this.props.data;
    let image;
    if (artist.images.length !== 0) {
      image = artist.images[artist.images.length - 1].url;
    }
    return (
      <PushableWrapper style={{ height: 100 }}>
        <Wrapper>
          <View>
            <Title>{artist.name}</Title>
          </View>
          <ImageWrapper>
            <BackgroundImage source={{ uri: image } || relatedIcon} />
          </ImageWrapper>
        </Wrapper>
      </PushableWrapper>
    );
  }
}

export default ResultCard;
