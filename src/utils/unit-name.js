// Units whose correct plural can't be derived by suffix rules alone
const PLURAL_OVERRIDES = {
  "yeoman guard": "Yeomen Guard",
  "knight of the realm": "Knights of the Realm",
};

export function displayUnitName(name, strength) {
  const singular = toSingular(name);
  if (strength > 1) {
    const override = PLURAL_OVERRIDES[singular.toLowerCase()];
    if (override) return override;
    return toPlural(singular);
  }
  return singular;
}

function toSingular(name) {
  return name.replace(/(\S+)$/, (last) => {
    if (last.endsWith("ies") && last.length > 4) return last.slice(0, -3) + "y";
    if (last.endsWith("ses") || last.endsWith("xes") || last.endsWith("zes"))
      return last.slice(0, -2);
    if (/men$/i.test(last) && last.length > 3) return last.slice(0, -3) + "man";
    if (last.endsWith("s") && !last.endsWith("ss") && last.length > 2)
      return last.slice(0, -1);
    return last;
  });
}

function toPlural(name) {
  return name.replace(/(\S+)$/, (last) => {
    if (last.endsWith("s")) return last;
    if (/man$/i.test(last)) return last.slice(0, -3) + "men";
    if (last.endsWith("y") && !/[aeiou]y$/i.test(last))
      return last.slice(0, -1) + "ies";
    return last + "s";
  });
}
