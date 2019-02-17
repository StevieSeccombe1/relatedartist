import { action, observable } from "mobx";
import { GENRES, SEARCH, TOKEN_URL } from "../../cfg";
import React from "react";

export default class SearchModel {
  @observable
  results = [];
  @observable
  state = "idle";
  @observable
  totalResults = "";
  @observable
  genres = [];

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
    return fetch(`${SEARCH}?&q=${str}`, {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${token}`
      })
    });
  };

  @action
  searchArtists = str => {
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        str = `${str}&type=artist`;
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

  @action
  searchRandomArtist = (genre, decade) => {
    this.id = null;
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        const str = `genre%3A${genre}%20year:${decade}&type=artist`;
        this.searchByArtist(token, str)
          .then(data => data.json())
          .then(data => {
            const offset = Math.floor(Math.random() * data.artists.total + 1);
            const newStr = str + `&limit=1&offset=${offset}`;
            this.searchByArtist(token, newStr)
              .then(data => data.json())
              .then(data => {
                this.results = data.artists.items;
                this.totalResults = data.artists.items.length;
                if (this.results.length === 0) {
                  this.state = "error";
                } else {
                  this.state = "success";
                }
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
  getGenres = () => {
    this.state = "loading";
    this.getToken()
      .then(data => data.json())
      .then(data => {
        const token = data.access_token;
        fetch(GENRES, {
          method: "get",
          headers: new Headers({
            Authorization: `Bearer ${token}`
          })
        })
          .then(data => data.json())
          .then(data => {
            let genres = [];
            {
              data.genres.map(genre => {
                const label = genre
                  .toLowerCase()
                  .split("-")
                  .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(" ");

                const newGenre = {
                  label: label,
                  value: genre
                };
                genres.push(newGenre);
              });
            }
            this.genres = genres;
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
