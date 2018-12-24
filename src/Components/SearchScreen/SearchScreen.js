import React, { Component } from "react";
import styled from "styled-components";
import { View } from "react-native";
import { SafeAreaView } from "react-navigation";
import ScreenBackground from "../../Common/ScreenBackground";
import Searchbar from "../../Common/Searchbar";
import Loader from "../../Common/Loader";
import { inject, observer } from "mobx-react";
import CalendarCard from "../CalendarCard/CalendarCard";
import PushableWrapper from "../../Common/PushableWrapper";
import HeaderBack from "../../Common/HeaderBack";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
  width: 100%;
`;

const ContentWrapper = styled(SafeAreaView)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const Footer = styled.Text`
  color: #aaa;
  font-size: 14px;
  margin: 20px 0;
`;

const ScrollWrapper = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const ResultCount = styled.Text`
  color: #eee;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
`;

@inject("search", "launches")
@observer
export default class SearchScreen extends Component {
  static navigationOptions = {
    title: "Setup Game",
    headerStyle: {
      backgroundColor: "#222437"
    },
    header: null,
    headerTintColor: "#fff"
  };

  componentDidMount() {
    this.reset();
  }

  // showDetails = data => {
  //   this.props.navigation.navigate("details", { data });
  // };

  setupGame(artist) {
    if (this.props.navigation.getParam("name") === "end") {
      this.props.launches.endArtist = artist;
      this.props.navigation.navigate("currentGame");
    } else {
      this.props.launches.startArtist = artist;
      this.props.launches.currentArtist = artist;
      if (artist.images.length !== 0) {
        this.props.launches.currentArtistImage = artist.images[0].url;
      }
      this.reset();
      this.props.navigation.navigate("searchScreen", { name: "end" });
    }
  }

  reset() {
    this.props.search.totalResults = 0;
    this.props.search.results = [];
  }

  render() {
    const { results, searchArtists, totalResults, state } = this.props.search;
    const name = this.props.navigation.getParam("name");
    return (
      <Wrapper>
        <HeaderBack
          ScreenTitle="Setup Game"
          navigateBack={() => this.props.navigation.goBack()}
        />
        <ContentWrapper>
          <Searchbar name={name} searchArtists={str => searchArtists(str)} />
          <ResultCount>{totalResults || 0} results</ResultCount>
          <ScrollWrapper>
            {state === "loading" && <Loader />}
            {results.length >= 0 && state === "success" && (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}
                >
                  {results.map(artist => (
                    <PushableWrapper
                      key={artist.id}
                      onPress={() => this.setupGame(artist)}
                    >
                      <CalendarCard data={artist} />
                    </PushableWrapper>
                  ))}
                </View>
              </>
            )}
            {/*<TouchableOpacity*/}
            {/*onPress={() => Linking.openURL("https://launchlibrary.net/")}*/}
            {/*>*/}
            {/*<Footer>Data provided by the Launch Library</Footer>*/}
            {/*</TouchableOpacity>*/}
          </ScrollWrapper>
        </ContentWrapper>
      </Wrapper>
    );
  }
}
