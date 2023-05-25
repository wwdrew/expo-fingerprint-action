# Expo Fingerprint action

An action that can be used to determine whether an Expo project requires an EAS build or an update.

## Rationale

Expo provides the [`expo-fingerprint`](https://github.com/expo/expo/tree/main/packages/@expo/fingerprint) tool as a way to "fingerprint" your repository, allowing you to compare changes made to the project and, subsequently, whether a new build or an update is required.

When developing an Expo application using EAS, if any code changes made don't require binary updates then it's better to perform an over-the-air update rather than rebuild the entire app.

**Note:** It's more stable to generate your app's fingerprint on the same system where you intend to build your released app. Differences between environments may generate false-positives, resulting in unnecessary rebuilds.

## Inputs

### `project-path`

Path to your Expo project. Default `"./"`.

### `fingerprint-path`

Location of your Expo fingerprint file. Default `"./expo-fingerprint.json"`.

If this file exists, it will be used to compare against the generated fingerprint.

Upon completion of the task, this file will be updated with the generated fingerprint.

It's recommended this file be committed to your repository for future comparisons.

## Outputs

### `matches`

Returns `"true"` if the generated fingerprint matches the stored fingerprint.

If no stored fingerprint exists, or it differs from the generated fingerprint, it returns `"false"`.

## Example usage

When creating a pull request, it's often useful to create a new build with your changes for QA to examine. If no native code has changed, it's better to push an update rather than a full build.

This example also demonstrates a way to commit the generated fingerprint. As this step adds a new commit to your branch, any actions you have configured that relate to pull requests will run again and may cause unnecessary builds or updates. This can be prevented by adding `[skip actions]` to the relevant commit message.

```yaml
on: [pull_request]

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
          message: 'chore: update expo fingerprint [skip actions]'

  build:
    runs-on: ubuntu-latest
    name: Run build task based on fingerprint changes
    needs: fingerprint
    if: ${{ needs.fingerprint.outputs.matches == 'false' }}
    steps:
      - run: echo "Run the build command"

  update:
    runs-on: ubuntu-latest
    name: Run update task based on no fingerprint changes
    needs: fingerprint
    if: ${{ needs.fingerprint.outputs.matches == 'true' }}
    steps:
      - run: echo "Run the update command"
```
