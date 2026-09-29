import { cvPage } from "../about";

export const menuDescription = "Social links, email, and CV.";
export const introduction = "You can get in touch with me through following channels:";

// Ordered links displayed after `cd contact`. Edit labels and previews here.
export const contactLinks = [
  {
    label: "LinkedIn",
    description: "@jeanyoonchoi",
    href: "https://www.linkedin.com/in/jeanyoonchoi",
  },
  {
    label: "Instagram",
    description: "@schumpeterstrasse",
    href: "https://www.instagram.com/schumpeterstrasse",
  },
  {
    label: "KAIST XD Lab",
    description: "xdlab.net",
    href: "https://www.xdlab.net/",
  },
  {
    label: "jeanyoon.choi@kaist.ac.kr",
    description: "KAIST email.",
    href: "mailto:jeanyoon.choi@kaist.ac.kr",
  },
  {
    label: "ericggul@gmail.com",
    description: "Personal email.",
    href: "mailto:ericggul@gmail.com",
  },
  cvPage,
] as const;
