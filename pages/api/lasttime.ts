import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { API_URL } from "lib/url";

export interface LastStartTimeResponse {
  date: string;
}
async function lastTimeRoute(
  req: NextApiRequest,
  res: NextApiResponse<LastStartTimeResponse>
) {
  const user = req.session.user;
  if (!user) {
    res.status(401);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/tracking/lasttime`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = (await response.json()) as LastStartTimeResponse;
    res.json(data);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default withIronSessionApiRoute(lastTimeRoute, sessionOptions);
