import React from "react";
import styled from "styled-components";
import spotifyIcon from "../../Assets/spotify.png";

const Wrapper = styled.View`
    margin: 10px;
    border-radius: 15px
    padding: 10px;
    width: 150px;
    justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.View`
  border-radius: 6px;
  width: 50px;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const Row = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  flexwrap: wrap;
`;

const Desc = styled.Text`
  color: white;
  font-size: 15px;
  ${({ bold }) => bold && "font-weight: bold;"} margin-top: 5px;
`;

const BackgroundImage = styled.Image`
  border-radius: 15px;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export default ({ data }) => {
  let image = require("../../Assets/spotify.png");
  if (data.images.length !== 0) {
    image = {
      uri: data.images[data.images.length - 1].url
    };
  }

  return (
    <Wrapper>
      <ImageWrapper>
        <BackgroundImage source={image} />
      </ImageWrapper>
      <Desc bold>{data.name}</Desc>
    </Wrapper>
  );
};
