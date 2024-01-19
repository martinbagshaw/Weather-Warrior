import React, { FC } from "react";
import { SearchForm } from "./SearchForm";

export const Main: FC = (): JSX.Element => (
  <main>
    <div className='container'>
      <SearchForm />
    </div>
  </main>
);
