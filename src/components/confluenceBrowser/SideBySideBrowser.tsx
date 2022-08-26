import React, { useState } from "react";
import { Confluence } from "../../auth";
import { ConfluenceBrowser } from "./ConfluenceBrowser";
import { Content } from "../../apiClients/confluence/content";

interface SideBySideBrowserProps {
  confluences: Confluence[];
}

export const SideBySideBrowser: React.FunctionComponent<
  SideBySideBrowserProps
> = ({ confluences }) => {
  const [copyCandidates, setCopyCandidates] = useState<Content[]>([]);
  const [destinationId, setDestinationId] = useState<string>();

  const addCopyCandidate = (candidate: Content): void => {
    setCopyCandidates((prevState) => prevState.concat([candidate]));
  };

  const removeCopyCandidate = (candidateId: string): void => {
    setCopyCandidates((prevState) =>
      prevState.filter((candidate) => candidate.id !== candidateId)
    );
  };

  return (
    <div className="side-by-side-browser">
      <div className="left">
        <ConfluenceBrowser
          confluences={confluences}
          addCopyCandidate={addCopyCandidate}
          removeCopyCandidate={removeCopyCandidate}
        />
      </div>
      <div className="right">
        <ConfluenceBrowser
          confluences={confluences}
          copyCandidates={copyCandidates.map((candidate) => ({
            content: candidate,
            destParentId: destinationId,
          }))}
          chooseCopyDestination={setDestinationId}
        />
      </div>
    </div>
  );
};
