import React, { Component } from "react";
import styled from "styled-components";
import { SafeAreaView } from "react-navigation";
import { ScrollView } from "react-native";
import { inject, observer } from "mobx-react";
import ScreenBackground from "../../Common/ScreenBackground";
import ScreenTitle from "../../Common/ScreenTitle";
import ErrorCard from "../ErrorCard";
import Loader from "../../Common/Loader";
import NewGameCard from "../NewGameCard/NewGameCard";
import GameCard from "../GameCard";
import Swipeout from "react-native-swipeout";
import Button from "../../Common/Button";

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
  restart(game) {
    game.current = game.start;
    game.links = 0;
    this.props.navigation.navigate("currentGame", { game });
  }

  render() {
    const { state } = this.props.artists;
    const gameList = this.props.artists.games;
    let games = [];
    if (gameList.length > 0) {
      games = gameList.map(game => {
        const swipeoutBtns = [
          {
            text: "Delete",
            backgroundColor: "#434343",
            onPress: () => this.props.artists.removeGame(game)
          },
          {
            text: "Restart",
            backgroundColor: "#2c2f53",
            onPress: () => this.restart(game)
          }
        ];
        return (
          <Swipeout right={swipeoutBtns} key={game.id} backgroundColor="#">
            <GameCard
              game={game}
              navigate={() =>
                this.props.navigation.navigate("currentGame", { game })
              }
              text="Continue Game"
            />
          </Swipeout>
        );
      });
    }

    return (
      <Wrapper>
        <ScreenTitle noBackgroundText="true" title="My Games" />
        <ContentWrapper>
          {state === "loading" ? (
            <Loader />
          ) : state === "error" ? (
            <ErrorCard />
          ) : (
            <ScrollView>{games}</ScrollView>
          )}
        </ContentWrapper>
        <Button
          title="New Game"
          onPress={() =>
            this.props.navigation.navigate("searchScreen", { name: "start" })
          }
          type="black"
          icon="plus"
        />
      </Wrapper>
    );
  }
}

export default DashboardScreen;
