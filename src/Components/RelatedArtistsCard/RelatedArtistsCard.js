import React from "react";
import styled from "styled-components";

const Wrapper = styled.View`
    border-radius: 15px
    padding: 10px;
    width: 125px;
    height: auto;
    align-items: center;
`;

const ImageWrapper = styled.View`
  border-radius: 6px;
  width: 50px;
  align-items: center;
  height: 50px;
`;

const Desc = styled.Text`
  color: white;
  font-size: 15px;
  ${({ bold }) => bold && "font-weight: bold;"} margin-top: 5px;
  text-align: center;
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
  let image = require("../../Assets/relatedIcon.png");
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
