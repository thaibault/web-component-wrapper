# Web-Component-Wrapper
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
