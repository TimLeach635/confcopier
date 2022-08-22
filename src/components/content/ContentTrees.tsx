import React from "react";
import { Content } from "../../apiClients/confluenceClient";
import { ContentCard } from "./ContentCard";

interface ContentTreeProps {
  rootContent: Content[];
}

export const ContentTrees: React.FunctionComponent<ContentTreeProps> = ({ rootContent }) => {
  return <ul>
    {rootContent.map(content =>
      <li key={content.id}>
        <ContentCard content={content} />
      </li>
    )}
  </ul>
}
