# Contributing Guide

## How to contribute?

You can add a new authorize and query method, or find problems from [issues](https://github.com/dev-protocol/khaos/issues) or fix other issues.

Basic Pull Request steps:

1. Fork this repository
1. Create your feature branch: `git checkout -b awesome-feature`
1. Commit your changes: `git commit -am "Add awesome feature"`
1. Push to the branch: `git push origin awesome-feature`
1. Submit a pull request to master branch in this repository

## How to start development for a new authorize and query method?

First as follows:

```
git clone git@github.com:YOUR/repository-token.git
cd repository-token
yarn
```

Copy the example directory to create a directory to implement new methods:

```
cp -r functions/example functions/YOUR_METHODS
```

Please change `package.json`, `authorizer.ts`, and `query.ts` under the new directory.

## How to start development for fix issues?

First as follows:

```
git clone git@github.com:YOUR/repository-token.git
cd repository-token
yarn
yarn start
```

If you change something, please update the test code as well.

Run all tests:

```
yarn test
```

If there is no problem tests succeed!
