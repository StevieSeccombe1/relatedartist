import { action, computed, decorate, observable, autorun } from "mobx";
import { AsyncStorage, PushNotificationIOS } from "react-native";
import "url-search-params-polyfill";
import { API_URL, ARTIST, SEARCH, TOKEN_URL } from "../../cfg";
import spotifyIcon from "../Assets/spotify.png";

storeData = async data => {
  try {
    await AsyncStorage.setItem(
      "@Spotilink:notifications",
      JSON.stringify(data)
    );
  } catch (error) {}
};

export default class LaunchesModel {
  @observable
  launches = [];

  @observable
  currentArtist = [];

  @observable
  startArtist = [];

  @observable
  endArtist = [];

  @observable
  relatedArtists = [];

  @observable
  currentArtistImage;

  @observable
  randomArtist = [];

  @observable
  games = [];

  @observable
  id;

  @observable
  nextLaunch = [];

  @observable
  state = "idle";

  @observable
  notifications = {
    enabled: false,
    delay: 10
  };

  @observable
  links = 0;

  @computed
  get upcomingLaunch() {
    return this.launches.length > 0 && this.launches[0];
  }

  @computed
  get numberOfLaunches() {
    return this.launches.length || 0;
  }

  @action
  initApp = async () => {
    try {
      const value = await AsyncStorage.getItem("@Spotilink:notifications");
      if (value !== null) {
        this.notifications = JSON.parse(value);
      }
    } catch (error) {}
  };

  storeNotificationSettings = async () => {
    try {
      await AsyncStorage.setItem(
        "@Spotilink:notifications",
        JSON.stringify(this.notifications)
      );
    } catch (error) {}
  };

  @action
  changeNotificationDelay = time => {
    if (this.notifications.delay + time >= 0) {
      this.notifications.delay += time;
      this.storeNotificationSettings();
    }
  };

  @action
  toggleNotifications = async () => {
    this.notifications.enabled = !this.notifications.enabled;
    this.storeNotificationSettings();
    if (this.notifications.enabled) {
      PushNotificationIOS.requestPermissions();
    } else {
      PushNotificationIOS.cancelAllLocalNotifications();
      PushNotificationIOS.removeAllDeliveredNotifications();
    }
  };

  @action
  scheduleNotification = data => {
    if (this.notifications.enabled) {
      PushNotificationIOS.getScheduledLocalNotifications(
        plannedNotifications => {
          if (plannedNotifications.length > 0) {
            PushNotificationIOS.cancelAllLocalNotifications();
          }
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: (data.wsstamp - 5 * 60) * 1000,
            alertBody: `🚀 ${data.name} will launch in just ${
              this.notifications.delay
            } minutes!`
          });
        }
      );
    }
  };

  @action
  loadNextLaunches = numberOfLaunches => {
    this.state = "loading";
    fetch(`${API_URL}next/${numberOfLaunches}`)
      .then(data => data.json())
      .then(data => {
        this.launches = data.launches;
        this.state = "success";
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  loadMoreLaunches = numberOfLaunches => {
    this.state = "loading";
    fetch(`${API_URL}next/${numberOfLaunches}?offset=${this.launches.length}`)
      .then(data => data.json())
      .then(data => {
        this.launches = [...this.launches, ...data.launches];
        this.state = "success";
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  getToken = () => {
    const searchParams = new URLSearchParams();
    searchParams.append("grant_type", "client_credentials");
    return fetch(TOKEN_URL, {
      method: "post",
      headers: new Headers({
        Authorization:
          "Basic YzM1ODZlZmY5Njg0NDJiMzk5ZmM2OThjNjBmNTliYzE6Nzk5Nzg4MmQ3ZjExNGQxOGJhMDQyM2IzZWJhM2NiOTU=",
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: searchParams.toString()
    });
  };

  @action
  getArtist = (id, token) => {
    return fetch(ARTIST + id, {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    });
  };

  @action
  getArtists = token => {
    return fetch(SEARCH + "?q=genre%3Ametal%20year%3A2001&type=artist", {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    });
  };

  @action
  getRandomArtist = (numberOfArtists, token) => {
    const offset = Math.floor(Math.random() * numberOfArtists + 1);
    return fetch(
      SEARCH +
        `?q=genre%3Ametal%20year%3A2001&type=artist&limit=1&offset=${offset}`,
      {
        method: "get",
        headers: new Headers({
          Authorization: `Bearer ${token}`
        })
      }
    );
  };

  @action
  getRelatedArtists = (id, token) => {
    return fetch(ARTIST + id + "/related-artists", {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    });
  };

  @action
  getCurrentArtist = id => {
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        this.getArtist(id, token)
          .then(data => data.json())
          .then(data => {
            this.currentArtist = data;
            this.currentArtistImage = spotifyIcon;
            if (data.images.length !== 0) {
              this.currentArtistImage = data.images[0].url;
            }
            this.getRelatedArtists(data.id, token)
              .then(data => data.json())
              .then(data => {
                this.relatedArtists = data.artists;
                this.state = "success";
              })
              .catch(err => {
                this.state = "error";
              });
          })
          .catch(err => {
            this.state = "error";
          });
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  storeGame = game => {
    const games = this.games;
    const currentGame = games.find(currentGame => game.id === currentGame.id);
    if (currentGame) {
      currentGame.start = game.start;
      currentGame.end = game.end;
      currentGame.current = game.current;
      currentGame.related = game.related;
      currentGame.links = game.links;
      this.games.replace(games);
    } else {
      this.games.push(game);
    }
  };

  @action
  startNewGame = () => {
    this.id = null;
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        this.getRelatedArtists(this.currentArtist.id, data.access_token)
          .then(data => data.json())
          .then(data => {
            this.relatedArtists = data.artists;
            this.state = "success";
          })
          .catch(err => {
            this.state = "error";
          })
          .catch(err => {
            this.state = "error";
          });
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  startRandomNewGame = () => {
    this.id = null;
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        this.getArtists(token)
          .then(data => data.json())
          .then(data => {
            Promise.all([
              this.getStartingArtist(data.artists.total, token),
              this.getEndingArtist(data.artists.total, token)
            ])
              .then(() => {
                this.state = "success";
              })
              .catch(err => {
                this.state = "error";
              });
          })
          .catch(err => {
            this.state = "error";
          });
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  continueGame = game => {
    this.id = game.id;
    this.startArtist = game.start;
    this.endArtist = game.end;
    this.currentArtist = game.current;
    this.relatedArtists = game.related;
    this.links = game.links;
  };

  @action
  getStartingArtist = (numberOfArtists, token) => {
    this.getRandomArtist(numberOfArtists, token)
      .then(data => data.json())
      .then(data => {
        const artist = data.artists.items[0];
        this.startArtist = artist;
        this.currentArtist = artist;
        if (artist.images.length !== 0) {
          this.currentArtistImage = artist.images[0].url;
        }
        this.getRelatedArtists(data.artists.items[0].id, token)
          .then(data => data.json())
          .then(data => {
            this.relatedArtists = data.artists;
          })
          .catch(err => {
            this.state = "error";
          });
      })
      .catch(err => {
        this.state = "error";
      });
  };

  @action
  getEndingArtist = (numberOfArtists, token) => {
    this.getRandomArtist(numberOfArtists, token)
      .then(data => data.json())
      .then(data => {
        this.endArtist = data.artists.items[0];
      })
      .catch(err => {
        this.state = "error";
      });
  };
}
