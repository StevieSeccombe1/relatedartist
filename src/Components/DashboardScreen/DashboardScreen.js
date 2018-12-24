import React, { Component } from "react";
import styled from "styled-components";
import { SafeAreaView } from "react-navigation";
import { RefreshControl, ScrollView, View } from "react-native";
import { inject, observer } from "mobx-react";
import ScreenBackground from "../../Common/ScreenBackground";
import ScreenTitle from "../../Common/ScreenTitle";
import ErrorCard from "../ErrorCard";
import Loader from "../../Common/Loader";
import NewGameCard from "../NewGameCard/NewGameCard";
import GameCard from "../GameCard";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
  padding: 40px 0 0 0;
`;

const ContentWrapper = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
`;

@inject("artists")
@observer
class DashboardScreen extends Component {
  startGame(custom) {
    if (custom) {
      this.props.navigation.navigate("searchScreen", { name: "start" });
    } else {
      this.props.navigation.navigate("currentGame", { name: "new" });
    }
  }

  render() {
    const { state } = this.props.artists;
    const gameList = this.props.artists.games;
    let games = [];
    if (gameList.length > 0) {
      games = gameList.map(game => (
        <GameCard
          key={game.id}
          game={game}
          navigateToGame={() =>
            this.props.navigation.navigate("currentGame", { game })
          }
        />
      ));
    }

    return (
      <Wrapper>
        <ScreenTitle title="My Games" />
        <NewGameCard
          name="Custom"
          navigateToGame={() => this.startGame(true)}
        />
        <NewGameCard name="Random" navigateToGame={() => this.startGame()} />

        <ContentWrapper>
          {state === "loading" ? (
            <Loader />
          ) : state === "error" ? (
            <ErrorCard />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={state === "loading"}
                  tintColor="#fff"
                />
              }
            >
              {games}
            </ScrollView>
          )}
        </ContentWrapper>
      </Wrapper>
    );
  }
}

export default DashboardScreen;
