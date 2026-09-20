import "./login.css"
import { withTargetValue, withEnterKey } from "@/lib/event-decorators"
import { Button } from "@/lib/buttons/button"
import {
  AuthStatus,
  AuthError,
  SetUsername,
  SetPassword,
  LogIn,
  LogOut,
  type State,
} from "@/main"

function LoginForm(props: { state: State }) {
  const { state } = props
  return (
    <div class="login">
      <h2 class="login__heading">Please Log In</h2>
      <p class="login__username">
        <input
          placeholder="Username"
          disabled={state.auth === AuthStatus.LOGGING_IN}
          type="text"
          name="username"
          value={state.username}
          oninput={withTargetValue(SetUsername)}
          onkeypress={withEnterKey(LogIn)}
        />
      </p>
      <p class="login__password">
        <input
          placeholder="Password"
          disabled={state.auth === AuthStatus.LOGGING_IN}
          type="password"
          name="password"
          value={state.password}
          oninput={withTargetValue(SetPassword)}
          onkeypress={withEnterKey(LogIn)}
        />
      </p>
      <p class="login__button">
        <Button disabled={state.auth === AuthStatus.LOGGING_IN} onclick={LogIn}>
          Log In
        </Button>
      </p>
      <p class="login__error">
        {state.authError === AuthError.NOUSERNAME
          ? "You forgot to enter a username"
          : state.authError === AuthError.NOPASSWORD
          ? "You forgot to enter a password"
          : state.authError === AuthError.INCORRECT
          ? "Email or password are incorrect"
          : state.authError === AuthError.SESSIONEND
          ? "Your session ended – please log in again"
          : ""}
      </p>
    </div>
  )
}

function LoggedInView(props: { state: State }) {
  const { state } = props
  return (
    <div>
      <h1>You are logged in </h1>
      <p>
        <button
          disabled={state.auth === AuthStatus.LOGGING_OUT}
          onclick={LogOut}
        >
          Log Out
        </button>
      </p>
    </div>
  )
}

function CheckingLoginState() {
  return <div>Checking Login State</div>
}

export function Login(props: { state: State }) {
  const { state } = props
  return state.auth === AuthStatus.CHECKING ? (
    <CheckingLoginState />
  ) : state.auth === AuthStatus.LOGGED_IN ||
    state.auth === AuthStatus.LOGGING_OUT ? (
    <LoggedInView state={state} />
  ) : (
    <LoginForm state={state} />
  )
}
