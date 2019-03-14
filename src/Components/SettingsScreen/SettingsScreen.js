import React, { Component } from "react";
import styled from "styled-components";
import { Linking } from "react-native";
import { SafeAreaView } from "react-navigation";
import { observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { version } from "../../../package.json";
import ScreenBackground from "../../Common/ScreenBackground";
import ScreenTitle from "../../Common/ScreenTitle";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
`;

const ContentWrapper = styled(SafeAreaView)`
  padding-top: 30px;
  flex: 1;
`;

const SectionsWrapper = styled.ScrollView`
  padding: 0 25px;
  margin-top: 10px;
`;

const Section = styled.TouchableOpacity`
  background: ${({ theme }) => theme.cardBackground};
  padding: 22px;
  height: 70px;
  ${props =>
    props.top &&
    `
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
    `} ${props =>
    props.bottom &&
    `
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      margin-bottom: 22px;
    `} margin-top: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${props => props.disabled && `opacity: 0.3;`};
`;

const SectionTitle = styled.Text`
  color: white;
`;

const Credits = styled.Text`
  color: #aaa;
  text-align: center;
  margin-bottom: 22px;
`;

@observer
class SettingsScreen extends Component {
  render() {
    return (
      <Wrapper>
        <ContentWrapper>
          <ScreenTitle noBackgroundText="true" title="About" />
          <SectionsWrapper>
            <Section
              top
              onPress={() =>
                Linking.openURL(
                  "https://github.com/StevieSeccombe1/relatedartist"
                )
              }
            >
              <SectionTitle>Source code</SectionTitle>
              <Icon name="github" size={22} color="#fff" />
            </Section>
            <Section
              bottom
              onPress={() => this.props.navigation.navigate("libraries")}
            >
              <SectionTitle>Licenses</SectionTitle>
              <Icon name="chevron-right" size={22} color="#fff" />
            </Section>
            <Section top bottom>
              <SectionTitle>About</SectionTitle>
              <SectionTitle>Version {version}</SectionTitle>
            </Section>
            <Credits>2019 - Stevie Seccombe</Credits>
          </SectionsWrapper>
        </ContentWrapper>
      </Wrapper>
    );
  }
}

export default SettingsScreen;
