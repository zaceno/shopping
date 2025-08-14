import "./main.css"
import { type State, AuthStatus } from "@/main"
import { Login } from "./login/login"
import { Shopping } from "./shopping/shopping"

const showLoginWindow = (state: State) =>
  state.auth === AuthStatus.LOGGED_OUT || state.auth === AuthStatus.LOGGING_IN

export default (state: State) => (
  <div id="app" class="main__container">
    {showLoginWindow(state) ? (
      <Login state={state} />
    ) : (
      <Shopping state={state} />
    )}
  </div>
)
