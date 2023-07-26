const capitalize = (txt: string) => {
  if (txt === "conPassword") {
    // I don't know why I did this for conPassword but I did.
    txt =
      txt.charAt(0).toUpperCase() +
      txt.slice(1, 3) +
      "firm" +
      txt.slice(3).replace(/([A-Z])/g, " $1");
  } else {
    txt = txt.charAt(0).toUpperCase() + txt.slice(1).replace(/([A-Z])/g, " $1");
  }

  return txt;
};

export default capitalize;
