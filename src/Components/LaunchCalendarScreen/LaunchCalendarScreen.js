import React, { Component } from "react";
import styled from "styled-components";
import { RefreshControl, ScrollView, View } from "react-native";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import ScreenBackground from "../../Common/ScreenBackground";
import CalendarCard from "../CalendarCard/CalendarCard";
import Loader from "../../Common/Loader";
import ErrorCard from "../ErrorCard";
import PushableWrapper from "../../Common/PushableWrapper";
import NextLaunchCard from "../NextLaunchCard";
import HeaderCard from "../HeaderCard";
import HeaderBack from "../../Common/HeaderBack";
import { SafeAreaView } from "react-navigation";

const Wrapper = styled(ScreenBackground)`
  flex: 1;
`;

@inject("launches")
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
      this.props.launches.continueGame(this.props.navigation.getParam("game"));
    } else if (this.props.navigation.getParam("name") === "new") {
      this.props.launches.startRandomNewGame();
    } else {
      this.props.launches.startNewGame();
    }
  }

  increment = () => {
    this.counter = this.counter + 1;
  };

  getRelatedArtists(id) {
    this.increment();
    this.props.launches.getCurrentArtist(id);
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
    this.props.launches.storeGame(game);
    this.props.navigation.navigate("dashboard");
  }

  render() {
    const data = this.props.launches;
    const currentArtist = this.props.launches.currentArtist;
    const currentArtistImage = this.props.launches.currentArtistImage;
    const endArtist = this.props.launches.endArtist;
    const startArtist = this.props.launches.startArtist;
    const relatedArtists = this.props.launches.relatedArtists;
    const id = this.props.launches.id;
    let links = this.props.launches.links;
    links = links + this.counter;

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

    if (currentArtist.id === endArtist.id && data.state === "success") {
      return (
        <Wrapper>
          <HeaderBack
            ScreenTitle="You Won"
            navigateBack={() => this.props.navigation.navigate("dashboard")}
          />
          <HeaderCard start={startArtist} end={endArtist} links={links} />
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
        {data.state === "loading" ? (
          <Loader />
        ) : (
          <View style={{ flex: 1 }}>
            <HeaderCard start={startArtist} end={endArtist} links={links} />
            <NextLaunchCard
              title="Current Artist"
              artist={currentArtist}
              image={currentArtistImage}
            />
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={data.state === "loading"}
                  tintColor="#fff"
                />
              }
            >
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
                    <CalendarCard data={artist} />
                  </PushableWrapper>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Wrapper>
    );
  }
}
