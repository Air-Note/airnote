import { NextApiRequest, NextApiResponse } from "next";

import { pool } from "@/utils/database";
import { verifyToken } from "@/utils/jwtUtils";

export default async function handler(req: CustomApiRequest, res: NextApiResponse) {
  // 토큰 확인
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    const { valid } = await verifyToken(accessToken);
    if (!valid) {
      return res.status(401).send('권한 없음');
    }
  } else {
    return res.status(401).send('비로그인 상태');
  }
  
  // 요청 처리
  switch (req.method) {
    case 'GET':
      const { address } = req.query;
      const searchPattern = `%${decodeURIComponent(address)}%`;
      const client = await pool.connect();
      const recordQuery = `
        SELECT
          r.post_id,
          u.email AS author_email,
          u.name AS author_name,
          CASE WHEN u.nickname IS NULL THEN '(탈퇴 사용자)' ELSE u.nickname END as author_nickname,
          r.address,
          r.address_detail,
          r.content,
          r.auth_file_url,
          SUM(CASE WHEN rt.reaction_type = 'like' THEN 1 ELSE 0 END) AS likes,
          SUM(CASE WHEN rt.reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislikes,
          r.create_at
        FROM RECORD_TB r
        LEFT JOIN USERS_TB u ON r.author_id = u.id
        LEFT JOIN REACTION_TB rt ON r.post_id = rt.post_id
        ${address ? "WHERE r.address ILIKE $1" : ''}
        GROUP BY r.post_id, u.email, u.name, u.nickname, r.address, r.address_detail, r.content, r.auth_file_url, r.create_at;
      `;
      const recordQueryResult = address ? (
        await client.query(recordQuery, [searchPattern])
      ) : (
        await client.query(recordQuery)
      );
      client.release();
      return res.status(200).json(recordQueryResult.rows);
    default:
      return res.status(405).send('잘못된 요청 메서드');
  }
}

interface CustomApiRequest extends NextApiRequest {
  query: {
    address: string;
  }
}