import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { API_URL } from "lib/url";

async function trackRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user) {
    res.status(401).json({ working: false });
    return;
  }

  try {
    console.log(req.body);
    const response = await fetch(`${API_URL}/tracking/track`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: req.body,
    });
    const { status } = response;
    res.status(status).json({});
    return;
  } catch (err) {
    console.log(err);
  }
}

export default withIronSessionApiRoute(trackRoute, sessionOptions);
