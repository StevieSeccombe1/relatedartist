import React, { Component } from "react";
import styled from "styled-components";
import { Alert, Picker, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import ScreenBackground from "../../Common/ScreenBackground";
import Searchbar from "../../Common/Searchbar";
import Loader from "../../Common/Loader";
import { inject, observer } from "mobx-react";
import RelatedArtistsCard from "../RelatedArtistsCard/RelatedArtistsCard";
import PushableWrapper from "../../Common/PushableWrapper";
import HeaderBack from "../../Common/HeaderBack";
import Button from "../../Common/Button";
import decades from "../../Assets/decades";
import ErrorCard from "../ErrorCard";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
  width: 100%;
`;

const ContentWrapper = styled(SafeAreaView)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding: 10px 0 0 0;
`;

const ScrollWrapper = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const Desc = styled.Text`
  color: #eee;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 80%;
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
      decade: "1950-1959",
      genre: "acoustic"
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
    this.props.search.getGenres();
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

  reset() {
    this.props.search.state = "idle";
    this.props.search.totalResults = 0;
    this.props.search.results = [];
  }

  render() {
    const {
      results,
      searchArtists,
      totalResults,
      state,
      genres
    } = this.props.search;
    const name = this.props.navigation.getParam("name");
    const { decade, genre } = this.state;
    let desc = "Search for a start artist or choose a genre and year below";
    if (this.props.navigation.getParam("name") === "end") {
      desc = "Now search for an end artist or choose a genre and year below";
    }
    return (
      <Wrapper>
        <HeaderBack
          ScreenTitle="Setup Game"
          navigateBack={() => this.props.navigation.goBack()}
        />
        <ContentWrapper>
          <Desc>{desc}</Desc>
          <Searchbar name={name} searchArtists={str => searchArtists(str)} />
          <ResultCount>{totalResults || 0} results</ResultCount>
          {state === "loading" && <Loader />}
          {results.length > 1 && state === "success" && (
            <ScrollWrapper>
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
            </ScrollWrapper>
          )}
          {results.length === 1 && state === "success" && (
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
          )}
          {state === "error" && (
            <ErrorCard
              text="Cannot load results or search criteria"
              onPress={() => {
                this.props.search.getGenres();
                this.reset();
              }}
            />
          )}
          {results.length <= 1 && state !== "error" && (
            <>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <Picker
                  selectedValue={genre}
                  style={{ width: 200 }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ genre: itemValue })
                  }
                  itemStyle={{ color: "white" }}
                >
                  {genres.map(genre => (
                    <Picker.Item
                      key={genre.value}
                      label={genre.label}
                      value={genre.value}
                    />
                  ))}
                </Picker>
                <Picker
                  selectedValue={decade}
                  style={{ width: 100 }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ decade: itemValue })
                  }
                  itemStyle={{ color: "white" }}
                >
                  {decades.map(decade => (
                    <Picker.Item
                      key={decade.value}
                      label={decade.label}
                      value={decade.value}
                    />
                  ))}
                </Picker>
              </View>
              <Button
                style={{ width: "100%" }}
                title="Get Random Artist"
                type="black"
                onPress={() =>
                  this.props.search.searchRandomArtist(
                    this.state.genre,
                    this.state.decade
                  )
                }
              />
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
