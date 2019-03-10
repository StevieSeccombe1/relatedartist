import React, { Component } from "react";
import styled from "styled-components";
import { Linking, ScrollView, View } from "react-native";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import ScreenBackground from "../../Common/ScreenBackground";
import RelatedArtistsCard from "../RelatedArtistsCard/RelatedArtistsCard";
import Loader from "../../Common/Loader";
import ErrorCard from "../ErrorCard";
import PushableWrapper from "../../Common/PushableWrapper";
import HeaderBack from "../../Common/HeaderBack";
import { SafeAreaView } from "react-navigation";
import GameCard from "../GameCard";
import Button from "../../Common/Button";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
`;

const Title = styled.Text`
  color: #eee;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
`;

@inject("artists")
@observer
export default class extends Component {
  static navigationOptions = {
    title: "Current Game",
    headerStyle: {
      backgroundColor: "#222437"
    },
    header: null,
    headerTintColor: "#fff"
  };

  @observable counter = 0;

  componentDidMount() {
    if (this.props.navigation.getParam("game")) {
      this.props.artists.continueGame(this.props.navigation.getParam("game"));
    }
  }

  increment = () => {
    this.counter = this.counter + 1;
  };

  getRelatedArtists(artist, game) {
    this.increment();
    game.links = game.links + 1;
    game.current = artist;
    this.props.artists.storeGame(game);
    this.props.artists.getCurrentArtist(artist.id);
  }

  goBack(game) {
    this.props.artists.storeGame(game);
    this.props.navigation.navigate("dashboard");
  }

  deleteGame(game) {
    this.props.artists.removeGame(game);
    this.props.navigation.navigate("dashboard");
  }

  restart(game) {
    this.props.artists.currentArtist = this.props.artists.startArtist;
    this.props.artists.links = 0;
    this.counter = 0;
    game.current = this.props.artists.startArtist;
    game.links = 0;
    this.props.artists.removeGame(game);
    this.props.artists.startNewGame();
  }

  render() {
    const data = this.props.artists;
    let links = this.props.artists.links;
    links = links + this.counter;
    const game = {
      id: this.props.artists.id,
      current: this.props.artists.currentArtist,
      end: this.props.artists.endArtist,
      start: this.props.artists.startArtist,
      related: this.props.artists.relatedArtists,
      links: links
    };

    if (data.state === "error") {
      return (
        <Wrapper>
          <SafeAreaView>
            <HeaderBack
              ScreenTitle="Current Game"
              navigateBack={() => this.props.navigation.navigate("dashboard")}
            />
            <ErrorCard onPress={this.getRelatedArtists(game.current, game)} />
          </SafeAreaView>
        </Wrapper>
      );
    }

    if (game.current.id && game.current.id === game.end.id) {
      return (
        <Wrapper>
          <HeaderBack
            ScreenTitle="You Won"
            navigateBack={() => this.deleteGame(game)}
          />
          <GameCard
            key={game.id}
            game={game}
            navigate={() => Linking.openURL(game.current.external_urls.spotify)}
            text="Listen on Spotify"
          />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <HeaderBack
          ScreenTitle="Current Game"
          navigateBack={() => this.goBack(game)}
        />
        {data.state === "success" && game.current.id ? (
          <View style={{ flex: 1 }}>
            <GameCard
              key={game.id}
              game={game}
              navigate={() =>
                Linking.openURL(game.current.external_urls.spotify)
              }
              text="Listen on Spotify"
            />
            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
              <Title>Select your next link</Title>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                {game.related.map(artist => (
                  <PushableWrapper
                    key={artist.id}
                    onPress={() => this.getRelatedArtists(artist, game)}
                  >
                    <RelatedArtistsCard data={artist} />
                  </PushableWrapper>
                ))}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <Button
                  title="Give Up"
                  onPress={() => this.deleteGame(game)}
                  type="black"
                />
                <Button
                  title="Restart"
                  onPress={() => this.restart(game)}
                  type="secondary"
                />
              </View>
            </ScrollView>
          </View>
        ) : (
          <Loader />
        )}
      </Wrapper>
    );
  }
}
