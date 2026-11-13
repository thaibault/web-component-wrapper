<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]tsickert.com) 16.12.2012

License
-------

This library written by Torben Sickert stands under a creative commons naming
4.0 international license.
See https://creativecommons.org/licenses/by/4.0/deed.de
endregion -->

<!--|deDE:Projektstatus-->
<!--|frFR:Statut du projet-->
Project Status
--------------

[![npm](https://img.shields.io/npm/v/web-component-wrapper?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)
[![npm downloads](https://img.shields.io/npm/dy/web-component-wrapper.svg?style=for-the-badge)](https://www.npmjs.com/package/web-component-wrapper)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/build.yaml?style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/build.yaml)
[![build push package](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/build-package-and-push.yaml?label=build%20push%20package&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/build-package-and-push.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/test-coverage-report.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/web-component-wrapper?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/web-component-wrapper)

[![deploy web documentation](https://img.shields.io/github/actions/workflow/status/thaibault/web-component-wrapper/deploy-web-documentation.yaml?label=deploy%20web%20documentation&style=for-the-badge)](https://github.com/thaibault/web-component-wrapper/actions/workflows/deploy-web-documentation.yaml)
[![web documentation](https://img.shields.io/website-up-down-green-red/https/tsickert.com/web-component-wrapper.svg?label=web-documentation&style=for-the-badge)](https://tsickert.com/web-component-wrapper)

<!--|deDE:Einsatzmöglichkeiten-->
<!--|frFR:Cas d'utilisation-->
Use case
--------

Write web components with little code or turn existing React components into
web components. Attributes are converted into typed properties, callbacks of
the component become DOM events and templates are re-rendered when
properties change. The resulting custom elements work in plain HTML and in
any framework.
<!--deDE:
    Schreiben Sie Web Components mit wenig Code oder machen Sie aus
    bestehenden React-Komponenten Web Components. Attribute werden in
    typisierte Eigenschaften umgewandelt, Callbacks der Komponente werden zu
    DOM-Ereignissen und Templates werden neu gerendert, wenn sich
    Eigenschaften ändern. Die entstehenden Custom Elements funktionieren in
    reinem HTML und in jedem Framework.
-->
<!--frFR:
    Écrivez des web components avec peu de code ou transformez des
    composants React existants en web components. Les attributs sont
    convertis en propriétés typées, les callbacks du composant deviennent des
    événements DOM et les templates sont rendus à nouveau lorsque les
    propriétés changent. Les custom elements obtenus fonctionnent en HTML pur
    et dans n'importe quel framework.
-->

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--><!--frFR:Contenu--></h2>
    <!--wd-table-of-contents-->
</div>

Installation
------------

```bash
npm install web-component-wrapper clientnode core-js
```

Wrapping React components additionally needs "react" and "react-dom". The
bundle "web-component-wrapper/bundle" already contains all dependencies,
including React, and can also be loaded from a CDN like
"https://unpkg.com/web-component-wrapper@latest/dist/bundle/index.js". For
older browsers use the "compatible" variants.
<!--deDE:
    Das Einbinden von React-Komponenten benötigt zusätzlich "react" und
    "react-dom". Das Bundle "web-component-wrapper/bundle" enthält bereits
    alle Abhängigkeiten einschließlich React und kann auch über ein CDN wie
    "https://unpkg.com/web-component-wrapper@latest/dist/bundle/index.js"
    geladen werden. Für ältere Browser verwenden Sie die
    "compatible"-Varianten.
-->
<!--frFR:
    L'encapsulation de composants React nécessite en plus "react" et
    "react-dom". Le bundle "web-component-wrapper/bundle" contient déjà
    toutes les dépendances, React compris, et peut aussi être chargé depuis
    un CDN comme
    "https://unpkg.com/web-component-wrapper@latest/dist/bundle/index.js".
    Pour les navigateurs plus anciens, utilisez les variantes "compatible".
-->

<!--|deDE:Eigene Web Components-->
<!--|frFR:Web components personnalisés-->
Own web components
------------------

Derive from "Web", set "doRender" and describe the markup in "content".
Expressions in "${...}" see all properties and are evaluated again whenever
a property changes. "property" declares a property, its attribute is the
name in kebab case:
<!--deDE:
    Leiten Sie von "Web" ab, setzen Sie "doRender" und beschreiben Sie das
    Markup in "content". Ausdrücke in "${...}" sehen alle Eigenschaften und
    werden bei jeder Änderung einer Eigenschaft neu ausgewertet. "property"
    deklariert eine Eigenschaft, ihr Attribut ist der Name in
    Kebab-Schreibweise:
-->
<!--frFR:
    Dérivez de "Web", activez "doRender" et décrivez le balisage dans
    "content". Les expressions dans "${...}" voient toutes les propriétés et
    sont réévaluées à chaque changement d'une propriété. "property" déclare
    une propriété, son attribut est le nom en kebab case:
-->

```JavaScript
import {string} from 'clientnode/property-types'
import {property, Web} from 'web-component-wrapper'

class MyGreeting extends Web {
    static doRender = true
    // NOTE: No template literal, "${...}" is evaluated when rendering.
    static content =
        '<button bind-on-click="self.greetingName = \'you\'">' +
        'Hello ${greetingName}!' +
        '</button>'
}
property({type: string})(MyGreeting.prototype, 'greetingName')

customElements.define('my-greeting', MyGreeting)
```

```HTML
<my-greeting greeting-name="World"></my-greeting>
```

Values are inserted as HTML, so do not render untrusted input this way.
With TypeScript you can use "@property" as decorator on class fields. Then
call "this.defineGetterAndSetterInterface()" in the constructor, since class
field initialization would otherwise overwrite the generated accessors.
<!--deDE:
    Werte werden als HTML eingefügt, rendern Sie auf diese Weise also keine
    unsicheren Eingaben. Mit TypeScript können Sie "@property" als Decorator
    an Klassenfeldern verwenden. Rufen Sie dann im Konstruktor
    "this.defineGetterAndSetterInterface()" auf, da die Initialisierung der
    Klassenfelder sonst die erzeugten Zugriffsmethoden überschreibt.
-->
<!--frFR:
    Les valeurs sont insérées en HTML, n'affichez donc pas de cette manière
    des saisies non fiables. Avec TypeScript, vous pouvez utiliser
    "@property" comme décorateur sur des champs de classe. Appelez alors
    "this.defineGetterAndSetterInterface()" dans le constructeur, car
    l'initialisation des champs de classe écraserait sinon les accesseurs
    générés.
-->

<!--|deDE:React-Komponenten einbinden-->
<!--|frFR:Encapsuler des composants React-->
Wrapping React components
-------------------------

"wrapAsWebComponent" turns a React component into a web component. Its
"propTypes" define the properties. Callbacks like "onChange" are dispatched
as DOM events ("change"):
<!--deDE:
    "wrapAsWebComponent" macht aus einer React-Komponente eine Web
    Component. Ihre "propTypes" legen die Eigenschaften fest. Callbacks wie
    "onChange" werden als DOM-Ereignisse ("change") ausgelöst:
-->
<!--frFR:
    "wrapAsWebComponent" transforme un composant React en web component. Ses
    "propTypes" définissent les propriétés. Les callbacks comme "onChange"
    sont émis comme événements DOM ("change"):
-->

```JavaScript
import {func, number, string} from 'clientnode/property-types'
import {createElement} from 'react'
import {wrapAsWebComponent} from 'web-component-wrapper'

const Counter = ({count = 0, label = 'Clicks', onChange}) =>
    createElement(
        'button',
        {onClick: () => onChange?.({count: count + 1})},
        `${label}: ${count}`
    )
Counter.propTypes = {count: number, label: string, onChange: func}

wrapAsWebComponent(
    Counter,
    'Counter',
    {
        controllableProperties: ['count'],
        propertiesToReflectAsAttributes: {count: number}
    }
).register('my-counter')
```

```HTML
<my-counter count="2" label="Votes"></my-counter>

<script>
    document.querySelector('my-counter').addEventListener(
        'change', (event) => console.log(event.detail.parameters[0].count)
    )
</script>
```

An object passed to a callback updates the matching properties.
"controllableProperties" lists those the web component manages itself, so
the button counts up without any surrounding code.
"propertiesToReflectAsAttributes" writes them back as attributes. Further
options:
<!--deDE:
    Ein an einen Callback übergebenes Objekt aktualisiert die passenden
    Eigenschaften. "controllableProperties" listet die, die die Web
    Component selbst verwaltet, sodass der Button ohne umgebenden Code
    hochzählt. "propertiesToReflectAsAttributes" schreibt sie als Attribute
    zurück. Weitere Optionen:
-->
<!--frFR:
    Un objet passé à un callback met à jour les propriétés correspondantes.
    "controllableProperties" liste celles que le web component gère
    lui-même, de sorte que le bouton compte sans code environnant.
    "propertiesToReflectAsAttributes" les réécrit en attributs. Autres
    options:
-->

- "eventToPropertyMapping": Maps callback arguments to properties per event,
  e.g. {onChange: (value) => ({value})}.<!--deDE:"eventToPropertyMapping": Bildet Callback-Argumente je Ereignis auf Eigenschaften ab, z. B. {onChange: (value) => ({value})}.--><!--frFR:"eventToPropertyMapping": Associe les arguments des callbacks aux propriétés par événement, par exemple {onChange: (value) => ({value})}.-->
- "propertyAliases": Alternative property names.<!--deDE:"propertyAliases": Alternative Eigenschaftsnamen.--><!--frFR:"propertyAliases": Noms de propriété alternatifs.-->
- "internalProperties": Fixed properties passed to the React component.<!--deDE:"internalProperties": Feste Eigenschaften, die an die React-Komponente übergeben werden.--><!--frFR:"internalProperties": Propriétés fixes transmises au composant React.-->
- "propTypes": Property types if the component does not define them.<!--deDE:"propTypes": Eigenschaftstypen, falls die Komponente keine definiert.--><!--frFR:"propTypes": Types de propriétés si le composant n'en définit pas.-->

"register" without argument derives the tag name from the component name,
e.g. "TextInput" becomes "text-input". Since tag names need a hyphen, single
words get the prefix "web-", e.g. "Counter" becomes "web-counter".
<!--deDE:
    "register" ohne Argument leitet den Tag-Namen aus dem
    Komponentennamen ab, z. B. wird "TextInput" zu "text-input". Da
    Tag-Namen einen Bindestrich benötigen, erhalten einzelne Wörter das
    Präfix "web-", z. B. wird "Counter" zu "web-counter".
-->
<!--frFR:
    "register" sans argument dérive le nom de balise du nom du composant,
    par exemple "TextInput" devient "text-input". Les noms de balise
    exigeant un trait d'union, les mots seuls reçoivent le préfixe "web-",
    par exemple "Counter" devient "web-counter".
-->

<!--|deDE:Attribute und Eigenschaften-->
<!--|frFR:Attributs et propriétés-->
Attributes and properties
-------------------------

The type of a property decides how its attribute is read:
<!--deDE:Der Typ einer Eigenschaft bestimmt, wie ihr Attribut gelesen wird:-->
<!--frFR:Le type d'une propriété détermine la lecture de son attribut:-->

- "string": Taken as it is.<!--deDE:"string": Wird unverändert übernommen.--><!--frFR:"string": Repris tel quel.-->
- "boolean": Set by the presence of the attribute.<!--deDE:"boolean": Wird durch das Vorhandensein des Attributs gesetzt.--><!--frFR:"boolean": Activé par la présence de l'attribut.-->
- "func": The attribute value is a function body. "event" and "parameters"
  hold the arguments of a call.<!--deDE:"func": Der Attributwert ist ein Funktionsrumpf. "event" und "parameters" enthalten die Argumente eines Aufrufs.--><!--frFR:"func": La valeur de l'attribut est un corps de fonction. "event" et "parameters" contiennent les arguments d'un appel.-->
- All other types, like "number", "object" or "array": Evaluated as
  JavaScript expression.<!--deDE:Alle anderen Typen wie "number", "object" oder "array": Werden als JavaScript-Ausdruck ausgewertet.--><!--frFR:Tous les autres types, comme "number", "object" ou "array": Évalués comme expression JavaScript.-->

For a component with the properties "title" (string), "highlighted"
(boolean), "options" (object) and "onSelect" (func):
<!--deDE:
    Für eine Komponente mit den Eigenschaften "title" (string),
    "highlighted" (boolean), "options" (object) und "onSelect" (func):
-->
<!--frFR:
    Pour un composant avec les propriétés "title" (string), "highlighted"
    (boolean), "options" (object) et "onSelect" (func):
-->

```HTML
<my-card
    highlighted
    on-select="console.log('Selected', parameters)"
    options="{size: 2 * 21}"
    title="Welcome"
></my-card>
```

Setting a property via JavaScript ("element.title = 'New'") renders again as
well.
<!--deDE:
    Auch das Setzen einer Eigenschaft per JavaScript
    ("element.title = 'New'") rendert erneut.
-->
<!--frFR:
    Définir une propriété en JavaScript ("element.title = 'New'") déclenche
    également un nouveau rendu.
-->

<!--|deDE:Bindungen in Templates-->
<!--|frFR:Liaisons dans les templates-->
### Bindings in templates

Elements inside "content" can bind to the component, and so can the
component's own element in HTML. Expressions see the properties, "self"
(the component), "parentInstance", "rootInstance" and for events "event" and
"parameters":
<!--deDE:
    Elemente innerhalb von "content" können sich an die Komponente binden,
    ebenso das Element der Komponente selbst im HTML. Ausdrücke sehen die
    Eigenschaften, "self" (die Komponente),
    "parentInstance", "rootInstance" und bei Ereignissen "event" und
    "parameters":
-->
<!--frFR:
    Les éléments dans "content" peuvent se lier au composant, tout comme
    l'élément du composant lui-même dans le HTML. Les expressions voient les
    propriétés, "self" (le composant),
    "parentInstance", "rootInstance" et, pour les événements, "event" et
    "parameters":
-->

- "bind-on-&lt;event&gt;": Runs code on an event, e.g. "bind-on-click".<!--deDE:"bind-on-&lt;event&gt;": Führt Code bei einem Ereignis aus, z. B. "bind-on-click".--><!--frFR:"bind-on-&lt;event&gt;": Exécute du code lors d'un événement, par exemple "bind-on-click".-->
- "bind-attribute-&lt;name&gt;": Sets an attribute to the expression's value.<!--deDE:"bind-attribute-&lt;name&gt;": Setzt ein Attribut auf den Wert des Ausdrucks.--><!--frFR:"bind-attribute-&lt;name&gt;": Définit un attribut à la valeur de l'expression.-->
- "bind-property-&lt;name&gt;": Sets a DOM property to the expression's
  value.<!--deDE:"bind-property-&lt;name&gt;": Setzt eine DOM-Eigenschaft auf den Wert des Ausdrucks.--><!--frFR:"bind-property-&lt;name&gt;": Définit une propriété DOM à la valeur de l'expression.-->

```HTML
<my-counter
    bind-on-change="console.log(event.detail.parameters[0].count)"
></my-counter>
```

Each of them can also be written with a "data-" prefix to keep the markup
valid HTML.
<!--deDE:
    Alle lassen sich auch mit dem Präfix "data-" schreiben, damit das Markup
    gültiges HTML bleibt.
-->
<!--frFR:
    Toutes peuvent aussi s'écrire avec le préfixe "data-" pour garder un
    balisage HTML valide.
-->

<!--|deDE:Entwicklung-->
<!--|frFR:Développement-->
Development
-----------

```bash
yarn install
yarn start
yarn test
```

"yarn start" serves a playground with examples.
<!--deDE:"yarn start" stellt eine Spielwiese mit Beispielen bereit.-->
<!--frFR:"yarn start" sert un terrain de jeu avec des exemples.-->
