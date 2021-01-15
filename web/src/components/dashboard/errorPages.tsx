import { StatusUnknown } from "grommet-icons";
import React from "react";
import { lang } from "src/i18n";
import { ErrorPage } from "../errors/ErrorPage";

const root = lang.pages.profile.error;

interface Props {
}

// handle 400
export const NoUserIdErrorPage: React.FC<Props> = ({ }) => (
  <ErrorPage
    titleId={root.noUserId.title}
    defaultDescriptionId={root.noUserId.description}
    Icon={StatusUnknown}
  />
);

export const UserNotExistErrorPage: React.FC<Props> = ({ }) => (
  <ErrorPage
    titleId={root.userNotFound.title}
    defaultDescriptionId={root.userNotFound.description}
    Icon={StatusUnknown}
  />
);
