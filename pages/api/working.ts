import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { API_URL } from "lib/url";

export interface WorkingResponse {
  working: boolean;
}
async function workingRoute(
  req: NextApiRequest,
  res: NextApiResponse<WorkingResponse>
) {
  const user = req.session.user;
  if (!user) {
    res.status(401).json({ working: false });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tracking/working`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = (await response.json()) as WorkingResponse;
    res.json(data);
    return;
  } catch (err) {
    console.log(err);
  }
}

export default withIronSessionApiRoute(workingRoute, sessionOptions);
