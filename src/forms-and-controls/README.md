# Forms and Controls

For simple inputs (text, number, etc.) we need no abstractions to implement Forms and Controls. DOM interfaces such as `HTMLInputElement` already provide two-way data binding through DOM properties (e.g. `input.value`) and events (`input.addEventListener()`).

More complex values (e.g. phone numbers, dates, currency) often require building tailored widgets using multiple HTML elements and CSS. We prefer to make abstractions over these widgets to make them easier to understand and (re)use.

Note that HTML is gradually adopting these complex widgets. For example, modern browsers support native controls such as [`<input type="tel">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel) and [`<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date). However, these native widgets are often harder to customize, and we still have to rely on traditional widgets for fine-grained control.

## Important ideas

- Two copies of data exist in the app:[^technically-three]
  - _Session state_ lives in memory. It is often structured as "record sets", but can be structured in any way.
  - _Screen state_ lives inside the GUI components themselves. In our app, this state is in the DOM.
- Session and screen states are synchronized via two-way _data binding_.
  - Simple values are directly synchronized.
  - Use events (and event handlers) for more complicated logic.
- Avoid cycles by controlling the direction of data flow.
  - Initialize the screen state (i.e. UI) with the session state.
  - Subsequent updates _usually_ alter the screen state, which flows back to the session state.

[^technically-three]: Technically, three copies of data exist in a client-server application. However, our sample app is client-only, which rules out the server state (or "record state" in Fowler's terms).

## Quotes (Emphasis Mine)

> In general data binding gets tricky because if you have to avoid cycles where a change to the control, changes the record set, which updates the control, which updates the record set&mldr;. The flow of usage helps avoid these - _we load from the session state to the screen when the screen is opened, after that any changes to the screen state propagate back to the session state. It's unusual for the session state to be updated directly once the screen is up._ As a result data binding might not be entirely bi-directional - just confined to initial upload and then propagating changes from the controls to the session state.

> Using data binding, with the right kind of parameterization, can take you a long way. However it can't take you all the way - there's almost always some logic that won't fit with the parameterization options. (&mldr;) There are various ways of getting this kind of thing to work - the common one for client-server toolkits was the notion of _events_.

> Once the routine in the form has control, it can then do whatever is needed. It can carry out the specific behavior and then modify the controls as necessary, _relying on data binding to propagate any of these changes back to the session state_.

This one is from the MVC section:

> Forms and Controls do [synchronization between screen state and session state] through the flow of the application manipulating the various controls that need to be updated directly.

## References

- [Relevant section from Martin Fowler's article](https://martinfowler.com/eaaDev/uiArchs.html#FormsAndControls)
