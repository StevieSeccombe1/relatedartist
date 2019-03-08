import React, { Component } from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";

const Wrapper = styled.TextInput`
  width: 80%;
  padding: 10px 0px;
  border-bottom-width: 2px;
  border-color: rgb(89, 175, 255);
  font-size: 20px;
  margin: 20px;
  color: white;
`;
@inject("search")
@observer
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStr: ""
    };
  }

  search(searchStr) {
    this.props.searchArtists(searchStr);
    this.state.searchStr = "";
  }

  checkText(searchStr) {
    if (searchStr === "") {
      this.props.search.totalResults = 0;
      this.props.search.results = [];
    }
    this.setState({ searchStr });
  }

  render() {
    const { searchStr } = this.state;
    return (
      <Wrapper
        value={searchStr}
        placeholder={`pick your ${this.props.name} artist...`}
        autoCorrect={false}
        placeholderTextColor="#777"
        returnKeyType="search"
        clearButtonMode="always"
        onChangeText={searchStr => this.checkText(searchStr)}
        onSubmitEditing={() => this.search(searchStr)}
      />
    );
  }
}

export default SearchBar;
