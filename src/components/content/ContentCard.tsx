import React from "react";
import { Content } from "../../client/confluenceClient";
import { expandContent } from "../../browser/expandContent";

interface ContentCardProps {
  content: Content;
}

export const ContentCard: React.FunctionComponent<ContentCardProps> = ({ content }) => {
  return <div id={`content-${content.id}`} className="content-card">
    <input id="checkbox-content-<%= content.id %>" name="<%= content.id %>" type="checkbox" />
      <label htmlFor="checkbox-content-<%= content.id %>">
        {content.title}</label>
      <button type="button" onClick={() => expandContent(content.id)}>Expand</button>
  </div>;
}
