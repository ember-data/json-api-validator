@ember-data/json-api-validator
==============================================================================

This package provides `json-api` validation utilities for applications built
 with `ember-data`.

`ember-data` expects users to normalize API payloads into `json-api` via serializers
  or other means before the data is pushed to the store. This is true for all requests,
  both manual and those made via "finders" such as `query` or `findRecord`.
 
 Most obscure "why doesn't ember-data work" errors can be caught earlier with more
  clarity by using this package to validate the payloads given to the store.

Installation
------------------------------------------------------------------------------

```
ember install @ember-data/json-api-validator
```


Usage
------------------------------------------------------------------------------

This addon automatically hooks into the `ember-data` store and validates data
 pushed into it against the `json-api` spec taking into account available `model`
 definitions and `ember-data` quirks (member names must be `camelCase`, type must
 be singular and dasherized).
 
Unknown attributes and relationships are ignored by default; however, you can choose
 to warn or assert unknown attributes or relationships instead.

For relationships, it validates that synchronous relationships are indeed included
 when specified. You may choose to make this a warning instead.

For polymorphic associations, it validates that pushed types are indeed polymorphic
 sub-classes of the base type.
 
In addition to automatically adding validation to the store, this addon provides
 an additional `validateJsonApiDocument` method on the store. You may also import
 and use the individual validation methods to validate generic `json-api` payloads
 without the additional context of available `Model` schemas.

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd @ember-data/json-api-validator`
* `yarn install`

### Linting

* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
