import {
  Header,
  Main,
  Loader,
  Error,
  StartScreen,
  Question,
  NextButton,
  Progress,
  Footer,
  Timer,
  FinishScreen,
} from "./components/";
import { useQuiz } from "./contexts/QuizContext";

function App() {
  const { status } = useQuiz();
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}

export default App;
