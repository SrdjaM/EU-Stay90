import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import classes from "../../styles/Loader.module.scss";

const NUMBER_OF_STARS = 8;

const Loader: React.FC = () => {
  const stars = Array.from({ length: NUMBER_OF_STARS });

  return (
    <div className={classes.loader}>
      {stars.map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={classNames(classes.star, classes[`star${index}`])}
        />
      ))}
    </div>
  );
};

export default Loader;
