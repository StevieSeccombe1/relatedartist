import React, { Component } from "react";
import styled from "styled-components";
import { Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const FullWidthWrapper = styled.View`
  align-items: center;
  margin: 10px;
`;

const Wrapper = styled(Animated.View)`
  align-items: center;
  width: 46px;
`;

const Note = styled.View`
  height: 24px;
  width: 24px;
`;

const Circle = styled.View`
  height: 46px;
  width: 46px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: white;
`;

export default class extends Component {
  state = {
    anim: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.anim, { toValue: 1, duration: 1000 })
    ).start();
  }

  render() {
    const rotation = this.state.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    return (
      <FullWidthWrapper>
        <Wrapper style={{ transform: [{ rotate: rotation }] }}>
          <Circle>
            <Note>
              <Icon name="music" size={20} color="white" />
            </Note>
          </Circle>
        </Wrapper>
      </FullWidthWrapper>
    );
  }
}
