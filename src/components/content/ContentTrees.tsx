import React from "react";
import { ContentCard } from "./ContentCard";
import { Content } from "../../apiClients/confluence/content";

interface ContentTreeProps {
  rootContent: Content[];
}

export const ContentTrees: React.FunctionComponent<ContentTreeProps> = ({
  rootContent,
}) => {
  return (
    <ul>
      {rootContent.map((content) => (
        <li key={content.id}>
          <ContentCard content={content} />
        </li>
      ))}
    </ul>
  );
};
