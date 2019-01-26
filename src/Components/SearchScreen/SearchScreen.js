import React, { Component } from "react";
import styled from "styled-components";
import { View, Picker } from "react-native";
import { SafeAreaView } from "react-navigation";
import ScreenBackground from "../../Common/ScreenBackground";
import Searchbar from "../../Common/Searchbar";
import Loader from "../../Common/Loader";
import { inject, observer } from "mobx-react";
import RelatedArtistsCard from "../RelatedArtistsCard/RelatedArtistsCard";
import PushableWrapper from "../../Common/PushableWrapper";
import HeaderBack from "../../Common/HeaderBack";
import Button from "../../Common/Button";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
  width: 100%;
`;

const ContentWrapper = styled(SafeAreaView)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const ScrollWrapper = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const Desc = styled.Text`
  color: #eee;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
`;

const ResultCount = styled.Text`
  color: #eee;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
`;

@inject("search", "artists")
@observer
export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decade: "80s"
    };
  }
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

  setupGame(artist) {
    if (this.props.navigation.getParam("name") === "end") {
      this.props.artists.endArtist = artist;
      this.props.navigation.navigate("currentGame");
    } else {
      this.props.artists.startArtist = artist;
      this.props.artists.currentArtist = artist;
      if (artist.images.length !== 0) {
        this.props.artists.currentArtistImage = artist.images[0].url;
      }
      this.props.artists.startNewGame();
      this.reset();
      this.props.navigation.navigate("searchScreen", { name: "end" });
    }
  }

  setupRandomGame(genre) {
    if (this.props.navigation.getParam("name") === "end") {
      this.props.artists.endGenre = genre;
      this.props.artists.startRandomNewGame();
      this.props.navigation.navigate("currentGame");
    } else {
      this.props.artists.startGenre = genre;
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
    const genres = [
      "metal",
      "rock",
      "pop",
      "jazz",
      "rap",
      "blues",
      "classical"
    ];
    const { decade } = this.state;
    return (
      <Wrapper>
        <HeaderBack
          ScreenTitle="Setup Game"
          navigateBack={() => this.props.navigation.goBack()}
        />
        <ContentWrapper>
          <Desc>Search for an artist or choose a genre and year below</Desc>
          <Searchbar name={name} searchArtists={str => searchArtists(str)} />
          <ResultCount>{totalResults || 0} results</ResultCount>
          <ScrollWrapper>
            {state === "loading" && <Loader />}
            {totalResults === 0 && (
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
                  {genres.map(genre => (
                    <PushableWrapper key={genres.indexOf(genre)}>
                      <Button
                        title={genre}
                        type="black"
                        onPress={() => this.setupRandomGame(genre)}
                      />
                    </PushableWrapper>
                  ))}
                  <Picker
                    selectedValue={decade}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ decade: itemValue })
                    }
                    itemStyle={{ color: "white" }}
                  >
                    <Picker.Item label="70s" value="70s" />
                    <Picker.Item label="80s" value="80s" />
                  </Picker>
                </View>
              </>
            )}
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
                      <RelatedArtistsCard data={artist} />
                    </PushableWrapper>
                  ))}
                </View>
              </>
            )}
          </ScrollWrapper>
        </ContentWrapper>
      </Wrapper>
    );
  }
}
