import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
console.log("requesting data from API");
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
