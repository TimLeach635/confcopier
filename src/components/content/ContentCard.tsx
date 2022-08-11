import React, { useState } from "react";
import { Content } from "../../client/confluenceClient";

interface ContentCardProps {
  content: Content;
}

export const ContentCard: React.FunctionComponent<ContentCardProps> = ({ content }) => {
  const [children, setChildren] = useState<Content[]>();

  const expandContent: React.MouseEventHandler = (e) => {
    e.preventDefault();
    fetch(`/content/${content.id}/children`)
      .then((response) => response.json())
      .then((body: Content[]) => {
        setChildren(body);
      })
  }

  let childrenOrButton: React.ReactNode = <></>;

  if (children === undefined) {
    childrenOrButton = <button type="button" onClick={expandContent}>Expand</button>
  } else if (children.length > 0) {
    childrenOrButton = <ul>
      {children.map((child) => <li key={child.id}>
        <ContentCard content={child} />
      </li>)}
    </ul>
  }

  return <div id={`content-${content.id}`} className="content-card">
    <input id={`checkbox-content-${content.id}`} name={`${content.id}`} type="checkbox" />
      <label htmlFor={`checkbox-content-${content.id}`}>
        {content.title}
      </label>
      {childrenOrButton}
  </div>;
}
