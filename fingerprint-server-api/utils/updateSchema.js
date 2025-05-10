const fs = require("fs");
const schemaUrl =
  "https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/schemas/fingerprint-server-api.yaml";

(async () => {
  const schema = await fetch(schemaUrl).then((res) => res.text());
  fs.writeFileSync("fingerprint-server-api.yaml", schema);
  console.log("Schema updated successfully");
})();
