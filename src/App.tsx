import { createGlobalStyle } from "styled-components";
import Main from './components/main'
const GlobalStyle = createGlobalStyle`
body{
  margin:0;
  padding:0;
}
/* .openlayers-map{
  padding-top :1rem;
  width:100vw;
  height:100vh;
} */
.map{
width: 100vw;
height:100vh;

}
`;
function App() {
  return (
    <div className="App">
      <GlobalStyle/>
      <Main/>
    </div>
  );
}

export default App;
