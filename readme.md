<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]torben.website) 16.12.2012

License
-------

This library written by Torben Sickert stand under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project status
--------------

[![npm](https://img.shields.io/npm/v/web-component-wrapper?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)
[![npm downloads](https://img.shields.io/npm/dy/web-component-wrapper.svg?style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/build.yaml?style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/build.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/web-component-wrapper?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/web-component-wrapper)

[![documentation website](https://img.shields.io/website-up-down-green-red/https/torben.website/web-component-wrapper.svg?label=documentation-website&style=for-the-badge)](https://torben.website/web-component-wrapper)

Use case
--------

Encapsulate your components as web-components.

## Data-Flow

Data can flow into a component via

- External property set `instance.value = 'value'`
- Trigger Events `instance.triggerEvent('click')`

Data can be communicated back via:

- Properties `console.log(instance.value)`
- Observable events `instance.addEventListener('click', (event) => console.log(event.detail.value))`

### Configuring Data-Flow

A Web-Component-Wrapper component forwards (transformed) given properties into
a wrapped react component via `props` and reads data via provided callbacks
as part of `props` or as part of reacts `ref` object.

<!-- region modline
vim: set tabstop=4 shiftwidth=4 expandtab:
vim: foldmethod=marker foldmarker=region,endregion:
endregion -->
