import React from "react";
import { PulseLoader } from "react-spinners";

import classes from "../styles/Loading.module.scss";

interface LoaderProps {
  loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <div className={classes["loader-container"]}>
      <PulseLoader color="#7aa7c7" loading={loading} size={20} />
    </div>
  );
};

export default Loader;
