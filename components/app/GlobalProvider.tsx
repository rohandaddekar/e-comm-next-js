"use client";

import { store, persistor } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "@/components/app/Loading";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Loading />}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default GlobalProvider;
