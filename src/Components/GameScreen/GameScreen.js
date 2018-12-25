import React, { Component } from "react";
import styled from "styled-components";
import { Linking, RefreshControl, ScrollView, View } from "react-native";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import ScreenBackground from "../../Common/ScreenBackground";
import RelatedArtistsCard from "../RelatedArtistsCard/RelatedArtistsCard";
import Loader from "../../Common/Loader";
import ErrorCard from "../ErrorCard";
import PushableWrapper from "../../Common/PushableWrapper";
import HeaderCard from "../HeaderCard";
import HeaderBack from "../../Common/HeaderBack";
import { SafeAreaView } from "react-navigation";
import GameCard from "../GameCard";

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
    } else if (this.props.navigation.getParam("name") === "new") {
      this.props.artists.startRandomNewGame();
    } else {
      this.props.artists.startNewGame();
    }
  }

  increment = () => {
    this.counter = this.counter + 1;
  };

  getRelatedArtists(id) {
    this.increment();
    this.props.artists.getCurrentArtist(id);
  }

  goBack(id, start, end, current, related, links) {
    let uuid = id;
    if (!uuid) {
      uuid = require("uuid/v4");
      uuid = uuid();
    }
    const game = {
      id: uuid,
      start,
      end,
      current,
      related,
      links
    };
    this.props.artists.storeGame(game);
    this.props.navigation.navigate("dashboard");
  }

  render() {
    const data = this.props.artists;
    const currentArtist = this.props.artists.currentArtist;
    const currentArtistImage = this.props.artists.currentArtistImage;
    const endArtist = this.props.artists.endArtist;
    const startArtist = this.props.artists.startArtist;
    const relatedArtists = this.props.artists.relatedArtists;
    const id = this.props.artists.id;
    let links = this.props.artists.links;
    links = links + this.counter;
    const game = {
      id: id,
      current: currentArtist,
      end: endArtist,
      start: startArtist,
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
            <ErrorCard onPress={this.getRelatedArtists(currentArtist.id)} />
          </SafeAreaView>
        </Wrapper>
      );
    }

    if (game.current.id && game.current.id === game.end.id) {
      return (
        <Wrapper>
          <HeaderBack
            ScreenTitle="You Won"
            navigateBack={() => this.props.navigation.navigate("dashboard")}
          />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <HeaderBack
          ScreenTitle="Current Game"
          navigateBack={() =>
            this.goBack(
              id,
              startArtist,
              endArtist,
              currentArtist,
              relatedArtists,
              links
            )
          }
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
            <ScrollView
              contentContainerStyle={{ alignItems: "center" }}
              refreshControl={
                <RefreshControl
                  refreshing={data.state === "loading"}
                  tintColor="#fff"
                />
              }
            >
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
                {relatedArtists.map(artist => (
                  <PushableWrapper
                    key={artist.id}
                    onPress={() => this.getRelatedArtists(artist.id)}
                  >
                    <RelatedArtistsCard data={artist} />
                  </PushableWrapper>
                ))}
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
