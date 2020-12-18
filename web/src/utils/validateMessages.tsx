import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "src/i18n";

const root = lang.validateMessages;

export const required = <LocalizedString id={root.required} />;
export const number = <LocalizedString id={root.number} />;
export const integer = <LocalizedString id={root.integer} />;
export const email = <LocalizedString id={root.email}/>;

