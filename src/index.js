import React, { useState, useEffect } from "react";
import constate from "constate";
import ReactDOM from "react-dom";

const [FormProvider, useFormContext, useFormValues] = constate(
  useFormState,
  value => value,
  value => value.values
);

const KEY = "key";
const AUTHENTICATED = "authenticated";

const prevAutheniticated = localStorage.getItem("authenticated") || false;
const prevKey = localStorage.getItem("key") || null;


const authUser = { user: "ryan", pwd: "apple", key:'iofsa' };

function useFormState({ initialValues = {} } = {}) {
  const [values, setValues] = useState(initialValues);
  return {
    values,
    register: (name, initialValue) =>
      setValues(prevValues => ({
        ...prevValues,
        [name]: prevValues[name] || initialValue
      })),
    update: (name, value) =>
      setValues(prevValues => ({ ...prevValues, [name]: value })),
    updateKey: value =>
      setValues(prevValues => ({ ...prevValues, [KEY]: value })),
    updateAuthenticated: value =>
      setValues(prevValues => ({ ...prevValues, [AUTHENTICATED]: value })),
    login: async (user, pwd) => {
      if (authUser.user === user && authUser.pwd === pwd) {
        console.log("Succesful login ", user);
        setValues(prevValues => ({
           ...prevValues,
            [AUTHENTICATED]: true,
            [KEY]: authUser.key 
          }));
        localStorage.setItem("authenticated", true);
        console.log(localStorage);
      } else {
        console.log("No success login ", user);
      }
    },
    logout: () => {
      setValues(prevValues => (
        { ...prevValues, [AUTHENTICATED]: false }
      ))
      localStorage.clear(); 
    }
  }
}


function Welcome()
{
  const state = useFormContext();
  return(
    <>
    {state.values.authenticated &&
    <p>Welcome, {state.values.username}</p>
    } 
    </>
  );
}

function useFormInput({ register, values, update, name, initialValue = "" }) {
  useEffect(() => register(name, initialValue), []);
  return {
    name,
    onChange: e => update(name, e.target.value),
    value: values[name] || initialValue
  };
}

function LoginForm({ onSubmit, onBack }) {
  const state = useFormContext();
  const username = useFormInput({ name: "username", ...state });
  const password = useFormInput({ name: "password", ...state });

  const submit = e => {
    e.preventDefault();
    state.login(username.value, password.value);
  };

  return (
    <form>
      {state.values.authenticated ? (
        <button
          onClick={e => {
            e.preventDefault();
            state.logout();
          }}
        >
          Logout
        </button>
      ) : (
        <>
          <input type="user" placeholder="User" {...username} />
          <input type="password" placeholder="Password" {...password} />
          <button type="submit" onClick={submit}>
            login
          </button>
        </>
      )}
    </form>
  );
}

function Values() {
  const values = useFormValues();
  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}


function App() {
  return (
    <FormProvider
      initialValues={{
        authenticated: prevAutheniticated,
      key: prevKey
      }}
    >
      <Welcome />
      <LoginForm />
      <Values />
    </FormProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
