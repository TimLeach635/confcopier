import { Space } from "../apiClients/confluence/space";

export const browserGetSpaces = async (subdomain: string): Promise<Space[]> => {
  const response = await fetch(`/api/${subdomain}/spaces`);
  return await response.json();
};
