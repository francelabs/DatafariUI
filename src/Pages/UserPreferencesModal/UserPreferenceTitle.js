import React from "react";

import { Tooltip, Typography } from "@material-ui/core";
import QuestionMarkIcon from "@material-ui/icons/Help";

function UserPreferenceTitle({ title, tooltip, placement = "right" }) {
  return (
    <Typography color="secondary">
      {title}{" "}
      <Tooltip
        style={{ verticalAlign: "middle" }}
        placement={placement}
        title={tooltip}
        aria-label={tooltip}
      >
        <span>
          <QuestionMarkIcon />
        </span>
      </Tooltip>
    </Typography>
  );
}

export default UserPreferenceTitle;
