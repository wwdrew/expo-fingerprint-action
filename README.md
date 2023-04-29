# Expo Fingerprint action

An action that can be used to determine whether an Expo project requires an EAS build or an update.

## Rationale

Expo provides the [`expo-fingerprint`](https://github.com/expo/expo/tree/main/packages/@expo/fingerprint) tool as a way to "fingerprint" your repository, allowing you to compare changes made to the project and, subsequently, whether a new build or an update is required.

When developing an Expo application using EAS, if any code changes made don't require any binary updates then it's better to perform an over-the-air update rather than rebuild the entire app.

**Note:** It's more stable to generate your app's fingerprint on the same system where you intend to build your released app. Differences between the two environments may generate false-positives resulting in unnecessary rebuilds.

## Inputs

### `project-path`

Path to your Expo project. Default `"./"`.

### `fingerprint-path`

Location of your Expo fingerprint file. Default `"./expo-fingerprint.json"`.

If this file exists, it will be loaded and used for comparing against the current project fingerprint.

Upon completion of the task, this file will be updated with the current project fingerprint.

It's recommended this file be committed to your repository for future comparisons.

## Outputs

### `matches`

Returns `"true"` if the current project fingerprint matches the stored fingerprint.

If no stored fingerprint exists, or it differs from the current project, it returns `"false"`.

## Example usage

```yaml
on: [push]

jobs:
  fingerprint:
    runs-on: ubuntu-latest
    name: Compare Expo fingerprints
    outputs:
      matches: ${{ steps.fingerprint.outputs.matches }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - uses: wwdrew/expo-fingerprint-action@v1.0
        id: fingerprint
      - uses: EndBug/add-and-commit@v9
        with:
          message: 'chore: update expo fingerprint'
```
