// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CheckA11yResponse } from "@/lib/check";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  results: CheckA11yResponse;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const url = req.body.url;

  const results = {
    url,
    violations: [],
    incomplete: [],
    inapplicable: [],
  };

  res.status(200).json({ results });
}
