import Marker from "./marker";
import FootPrint from "./footPrint/footPrint";
import FootTraffic from "./footTraffic";
import Rotation from "./rotation";
import Polygon from "./polygon";
import { Switch, Route } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";
import styled from "styled-components";
import React from "react";

const LinkStyle = styled(Link)`
  text-decoration: none;
  margin: 3rem 1rem;
  font-weight: 700;
  color: gray;
  &:active,
  &:focus {
    color: black;
  }
`;

const Main = () => {
  return (
    <Router>
      <span>
        <LinkStyle to="/rotation">Rotation</LinkStyle>
        <LinkStyle to="/footTraffic">FootTraffic</LinkStyle>
        <LinkStyle to="/footPrint">FootPrint</LinkStyle>
        <LinkStyle to="/polygon">Poylgon</LinkStyle>
        <LinkStyle to="/marker">Marker</LinkStyle>
      </span>
      <Switch>
        <Route path="/marker" component={Marker}></Route>
        <Route path="/footPrint" component={FootPrint}></Route>
        <Route path="/footTraffic" component={FootTraffic}></Route>
        <Route path="/rotation" component={Rotation}></Route>
        <Route path="/polygon" component={Polygon}></Route>
      </Switch>
    </Router>
  );
};

export default Main;
