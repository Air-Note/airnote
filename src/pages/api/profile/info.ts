import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { pool } from "@/utils/database";

const secret = process.env.NEXT_AUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret });

  // Forbidden
  if (!token) {
    return res.status(403).send('접근 금지');
  }

  switch (req.method) {
    case 'GET':
      try {
        const client = await pool.connect();
        const userInfoQuery = `SELECT id, email, nickname, name, phone_number, create_at FROM USERS_TB WHERE email = $1`;
        const userInfoQueryResult = await client.query(userInfoQuery, [token.email]);
        client.release();
        return res.status(200).json(userInfoQueryResult.rows[0]);
      } catch (err) {
        console.error(err);
        return res.status(500).send('내부 서버 오류')
      }
    case 'PUT':
      const body = req.body;
      try {
        const client = await pool.connect();
        // 닉네임 중복확인
        const duplicateConfirmQuery = `SELECT nickname FROM USERS_TB WHERE nickname = $1`;
        const duplicateConfirmQueryResult = await client.query(duplicateConfirmQuery, [body.nickname]);
        if (duplicateConfirmQueryResult.rows.length) {
          return res.status(409).send('닉네임 중복 발생');
        }

        // 닉네임 변경 수행
        const nicknameChangeQuery = `
          UPDATE USERS_TB
          SET nickname = $1
          WHERE email = $2
          RETURNING nickname;
        `;
        const nicknameChangeQueryResult = await client.query(nicknameChangeQuery, [body.nickname, token.email]);
        client.release();
        return res.status(204).json({
          success: true,
          message: 'Nickname updated successfully',
          updateNickname: nicknameChangeQueryResult.rows[0].nickname
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send('내부 서버 오류');
      }
    default:
      return res.status(405).send('잘못된 요청 메서드');
  }
}