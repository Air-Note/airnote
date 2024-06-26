import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      res.setHeader('Set-Cookie', [
        `accessToken=; Path=/; Expires=${new Date(0).toUTCString()}; HttpOnly`,
        `refreshToken=; Path=/; Expires=${new Date(0).toUTCString()}; HttpOnly`
      ]);
      return res.status(200).send('로그아웃 성공');
    default:
      return res.status(405).send('잘못된 요청 메서드');
  }
}