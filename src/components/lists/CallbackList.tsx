import React from "react";

interface ListElement {
  key: string;
  title: string;
  lines: string[];
}

interface CallbackListProps<T extends ListElement> {
  elementsWithCallbacks: {
    element: T;
    callbackOnClick: (element: T) => void;
  }[];
}

export function CallbackList<T extends ListElement>({
  elementsWithCallbacks,
}: React.PropsWithChildren<CallbackListProps<T>>) {
  return (
    <ul className="callback-list">
      {elementsWithCallbacks.map((elementWithCallback) => (
        <li key={elementWithCallback.element.key}>
          <button
            onClick={(e) => {
              e.preventDefault();
              elementWithCallback.callbackOnClick(elementWithCallback.element);
            }}
          >
            <h2>{elementWithCallback.element.title}</h2>
            {elementWithCallback.element.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </button>
        </li>
      ))}
    </ul>
  );
}
