import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import { auth, db } from "./firebase";

axios
  .get(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })
  .then(response => console.log(response.data));

axios
  .get("https://jsonplaceholder.typicode.com/posts", {
    headers: {
      "Access-Control-Allow-Origin": window.location.origin
    }
  })
  .then(response => {
    console.log("API response received");
    return response;
  })
  .then(response => {
    console.log("response.data", response.data);
    response.data.forEach(post => {
      state.Blog.posts.push(post);
    });
    const params = router.lastRouteResolved().params;
    console.log("params", params);
    if (params) {
      render(state[params.page]);
    }
  });

const render = (st = state.Home) => {
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;
  router.updatePageLinks();
  addNavToggle();
  // addNavEventListeners();
  addPicOnFormSubmit(st);

  listenForUserRegister(st);
  listenForSignOut();
  listenForLogIn(st);
};

const router = new Navigo(window.location.origin);
router
  .on({
    "/": () => render(),
    ":page": params => {
      const enteredRoute = params.page;
      const formattedRoute = capitalize(enteredRoute);
      const pieceOfStateRequestedByUser = state[formattedRoute];
      render(pieceOfStateRequestedByUser);
    }
  })
  .resolve();
// render();

// REGISTER
function listenForUserRegister(st) {
  if (st.view === "Register") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      const inputs = inputList.map(input => input.value);
      let username = inputs[0];
      let email = inputs[1];
      let password = inputs[2];

      // create user in auth
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          addUserToState(username, email);
          addUserToDb(username, email);
        })
        .then(() => render());
    });
  }
}
function addUserToState(username, email) {
  state.User.username = username;
  state.User.email = email;
  state.User.loggedIn = true;
  console.log("user added to state");
  console.log(state.User);
}
function addUserToDb(username, email) {
  db.collection("users")
    .add({
      username: username,
      email: email,
      loggedIn: true
    })
    .then(() => {
      console.log("user added to DB");
    });
}

// LOG-OUT
function listenForSignOut() {
  document.querySelector("header a").addEventListener("click", event => {
    event.preventDefault();
    auth.signOut().then(() => {
      signOutUserInDb(state.User);
      removeUserFromState();
    });
  });
}
function removeUserFromState() {
  state.User.username = "";
  state.User.email = "";
  state.User.loggedIn = false;
  console.log("user removed to state");
  console.log(state.User);
}
function signOutUserInDb(user) {
  let email = user.email;
  db.collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({ loggedIn: false });
        }
      })
    )
    .then(() => console.log("user signed out in DB"));
}

// LOG-IN
function listenForLogIn(st) {
  console.log("log-in function");
  if (st.view === "Signin") {
    console.log("view is sign in");
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      console.log("form submitted");
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      const inputs = inputList.map(input => input.value);
      let email = inputs[0];
      let password = inputs[1];

      auth.signInWithEmailAndPassword(email, password).then(() => {
        signInUserInDb(email);
      });
    });
  }
}
function signInUserInDb(email) {
  db.collection("users")
    .get()
    .then(snapshot =>
      snapshot.docs.forEach(doc => {
        if (email === doc.data().email) {
          let id = doc.id;
          db.collection("users")
            .doc(id)
            .update({ loggedIn: true });
          addUserToState(doc.data().username, doc.data().email);
        }
      })
    )
    .then(() => console.log("user signed in in DB"));
}

function addNavEventListeners() {
  document.querySelectorAll("nav a").forEach(navLink => {
    navLink.addEventListener("click", event => {
      event.preventDefault();
      // render(state[event.target.textContent]);
      let selectedPage = event.target.textContent;
      let pieceOfState = state[selectedPage];
      render(pieceOfState);
    });
  });
}
function addNavToggle() {
  // add menu toggle to bars icon in nav bar
  document.querySelector(".fa-bars").addEventListener("click", () => {
    document.querySelector("nav > ul").classList.toggle("hidden--mobile");
  });
}

function addPicOnFormSubmit(st) {
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      let inputs = event.target.elements;
      let newPic = {
        url: inputs[0].value,
        title: inputs[1].value
      };
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
}
