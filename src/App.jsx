import { useEffect, useReducer } from "react";
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

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsReamaing: null,
};

function reducer(state, action) {
  // const question = state.questions.at(state.index);
  const question = state.questions[state.index];

  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsReamaing: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        highScore: state.highScore,
      };
    // return { ...state, status: "ready", points: 0, index: 0, answer: null };
    case "tick":
      return {
        ...state,
        secondsReamaing: state.secondsReamaing - 1,
        status: state.secondsReamaing === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknwon action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    secondsReamaing,
  } = state;

  useEffect(function () {
    // fetch("http://localhost:8000/questions")
    fetch("https://salaheddineaz47.github.io/host-api/questions.json")
      .then((result) =>result.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data.questions }))
      .catch((err) => {
        dispatch({ type: "dataFailed" });
        console.log(err);
      });
  }, []);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer secondsReamaing={secondsReamaing} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
