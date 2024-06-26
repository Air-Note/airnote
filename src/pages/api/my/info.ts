import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { Db } from "mongodb";

import { connectDB } from "@/utils/database";
import { decrypt } from "@/utils/modules";

const secret = process.env.NEXT_AUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const { user } = req.query;

      // Forbidden
      if (!user || typeof(user) !== 'string') {
        return res.status(403).send('접근 금지');
      }

      const decrypted_user = decrypt(decodeURIComponent(user), process.env.NEXT_PUBLIC_AES_EMAIL_SECRET_KEY);
      try {
        const db: Db = await connectDB();
        const user_info = await db.collection('user_data').findOne(
          { email: decrypted_user },
          { projection: { email: 1, nickname: 1 } }
        );
        const reviews = await db.collection('reviews_data').find(
          { author_email: decrypted_user },
          {
            projection: {
              latitude: 0,
              longitude: 0,
              auth_file: 0
            }
          }
        ).toArray();
        return res.status(200).json({ user_info, reviews });
      } catch (err) {
        console.error(err);
        return res.status(500).send('내부 서버 오류')
      }
    case 'PUT':
      const token = await getToken({ req, secret });

      // Unauthorized
      if (!token) {
        return res.status(401).send('접근 권한 없음');
      }

      const body = req.body;
      try {
        const db: Db = await connectDB();

        // 닉네임 중복확인
        const duplicateConfirm = await db.collection('user_data').findOne({ nickname: body.nickname });
        if (duplicateConfirm) {
          return res.status(409).send('닉네임 중복 발생');
        }

        // 닉네임 변경 수행
        const userInfoUpdate = await db.collection('user_data').updateOne(
          { email: token.email },
          { $set: { nickname: body.nickname } }
        )
        const reviewsUpdate = await db.collection('reviews_data').updateMany(
          { author_email: token.email },
          { $set: { author_name: body.nickname } }
        );
        return res.status(204).send('닉네임 변경 성공');
      } catch (err) {
        console.error(err);
        return res.status(500).send('내부 서버 오류');
      }
    default:
      return res.status(405).send('잘못된 요청 메서드');
  }
}