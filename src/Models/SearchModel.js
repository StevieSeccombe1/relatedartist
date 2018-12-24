import { action, observable } from "mobx";
import { SEARCH, TOKEN_URL } from "../../cfg";

export default class SearchModel {
  @observable
  results = [];
  @observable
  state = "idle";
  @observable
  totalResults = "";

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
  searchByArtist = (token, str) => {
    return fetch(`${SEARCH}?type=artist&q=${str}`, {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    });
  };

  // @action
  // searchLaunches = str => {
  //     this.state = "loading";
  //     fetch(`${API_URL}/${str}`)
  //         .then(data => data.json())
  //         .then(data => {
  //             this.results = data.launches || [];
  //             this.totalResults = data.total;
  //             this.state = "success";
  //         })
  //         .catch(err => {
  //             this.state = "error";
  //         });
  // };

  @action
  searchArtists = str => {
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        this.searchByArtist(token, str)
          .then(data => data.json())
          .then(data => {
            this.results = data.artists.items || [];
            this.totalResults = data.artists.total;
            this.state = "success";
          })
          .catch(err => {
            this.state = "error";
          });
      })
      .catch(err => {
        this.state = "error";
      });
  };
}
