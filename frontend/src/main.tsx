import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { client } from "./graphql/apolloClient.ts";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={client}>
          <App />
          <Toaster
            reverseOrder={true}
            position="bottom-right"
            toastOptions={{
              style: {},
            }}
          />
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
