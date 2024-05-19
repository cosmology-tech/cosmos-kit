# Starship Global Configs

## Setup Starship in a package

### Create Directory Structure Below within the package

- `jest.starship.config.js` local jest config
- `starship/` local starship directory
- `starship/tests` test files
- `starship/src` supporting files
- `starship/starship.yaml` starship helm config

### jest.starship.config.js

```js
const sharedConfig = require('../../starship/jest.starship.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...sharedConfig,
};
```

### starship/starship.yaml

```yaml
helmName: cosmo-kit-test
helmFile: ../../../starship/config.yaml
helmVersion: v0.1.38
```

### Add Scripts to package.json

```json
{
  "scripts": {
    "starship": "starship --config ./starship/starship.yaml",
    "starship:deploy": "starship deploy --config ./starship/starship.yaml",
    "starship:ports": "starship start-ports --config ./starship/starship.yaml",
    "starship:teardown": "starship teardown --config ./starship/starship.yaml",
    "starship:test": "jest --config ./jest.starship.config.js --verbose --bail",
    "starship:debug": "jest --config ./jest.starship.config.js --runInBand --verbose --bail",
    "starship:watch": "jest --watch --config ./jest.starship.config.js"
  }
}
```
